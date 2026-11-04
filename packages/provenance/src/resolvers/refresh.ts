import type { TokenRequestResult } from '../tokens';
import { logStarter } from '../helpers';
import { type AuthServerAvailability, isGrantRefused } from './availability';
import { Resolver } from './types';

// an eager refresh of a token that still works must not hold the request for long
const VALID_TOKEN_REFRESH_TIMEOUT = 1000;

export const refreshResolver = <
	Session extends {
		refreshToken: string;
		accessExpiresAt: number;
		refreshExpiresAt?: number;
	}
>(options: {
	/** in ms */
	eagerRefresh: number;
	/**
	 * when given, the session is dropped only when the token endpoint refuses the refresh (400
	 * or 401). any other failure, or no answer within `timeout` ms, keeps the session, sets
	 * `locals.authDegraded` and pauses refreshes
	 */
	outage?: { availability: AuthServerAvailability; timeout: number };
}): Resolver<Session> => {
	return async (context, resolve, logging) => {
		const session = context.locals.session;

		// attempt refresh if there is a session and the access token expires within the "eagerRefresh" threshold
		if (session !== null && Date.now() >= session.accessExpiresAt - options.eagerRefresh) {
			if (logging) logStarter('refresh');

			const destroySession = () => {
				context.session.deleteCookie();
				context.locals.session = null;
			};

			const outage = options.outage;

			// don't bother trying to refresh if your session has an expired refresh token
			// in practice, this should be true as the session cookie should expire at the same time as the refresh token
			if (session.refreshExpiresAt !== undefined && Date.now() >= session.refreshExpiresAt) {
				destroySession();
			} else if (outage?.availability.isPaused()) {
				context.locals.authDegraded = true;
			} else {
				let newTokens: TokenRequestResult | undefined;
				try {
					const timeout =
						Date.now() < session.accessExpiresAt
							? Math.min(outage?.timeout ?? Infinity, VALID_TOKEN_REFRESH_TIMEOUT)
							: outage?.timeout;
					const signal = outage && timeout ? AbortSignal.timeout(timeout) : undefined;
					newTokens = await context.oauth.refresh(session.refreshToken, { signal });
				} catch (e) {
					console.error('provenance:', e);

					// the auth server did not refuse the session, so keep it until the auth server answers
					if (outage && !isGrantRefused(e)) {
						outage.availability.pause();
						context.locals.authDegraded = true;
					} else {
						destroySession();
					}
				}

				if (newTokens) {
					try {
						const newSession = context.session.create(newTokens);

						destroySession();
						context.session.setCookie(newSession);
						context.locals.session = newSession;
					} catch (e) {
						// the auth server answered with tokens this provider cannot use
						console.error('provenance:', e);
						destroySession();
					}
				}
			}
		}
		return await resolve();
	};
};
