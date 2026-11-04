import { logStarter, sanitizeReferrer } from '../helpers';
import type { AuthServerAvailability } from './availability';
import type { Resolver } from './types';

const withStatus = (response: Response, status: number) =>
	new Response(response.body, { status, headers: response.headers });

export const loginResolver =
	<Session>(options?: {
		/** drop the session on the login route, so a visit always signs in again */
		forceLogin?: boolean;
		/**
		 * when given, the login route first fetches `discoveryUrl` (within `timeout` ms)
		 *
		 * if the auth server does not answer, the session is kept, `locals.authDegraded` is set,
		 * and the app's own login route renders with a 503, instead of a redirect to an auth
		 * server that is down
		 */
		outage?: { availability: AuthServerAvailability; timeout: number; discoveryUrl: URL };
	}): Resolver<Session> =>
	async (context, resolve, logging) => {
		if (context.routes.login.is) {
			const outage = options?.outage;
			if (outage) {
				let answers = false;
				// while paused, the auth server is not checked again, and the pause does not grow
				if (!outage.availability.isPaused()) {
					answers = await context.oauth.checkAuthServer({
						url: outage.discoveryUrl,
						timeout: outage.timeout
					});
					if (!answers) outage.availability.pause();
				}

				if (!answers) {
					context.locals.authDegraded = true;
					return withStatus(await resolve(), 503);
				}
			}

			if (options?.forceLogin) {
				context.session.deleteCookie();
				context.locals.session = null;
			}

			const session = context.locals.session;
			const referrer = sanitizeReferrer(context.oauth.referrer);

			if (session === null) {
				if (logging) logStarter('login');

				await context.oauth.redirectLogin(referrer);
			} else {
				return referrer ? context.routes.redirect(referrer) : context.routes.home.redirect();
			}
		}
		return await resolve();
	};
