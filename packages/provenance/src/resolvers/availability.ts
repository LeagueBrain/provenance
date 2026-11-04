import { TokenEndpointError } from '../tokens';

/**
 * remembers, per server instance, that the auth server did not answer
 *
 * while paused, resolvers do not call the auth server, so a recovering auth server is not
 * flooded with requests
 */
export type AuthServerAvailability = {
	isPaused: () => boolean;
	pause: () => void;
};

export const authServerAvailability = (pauseMs: number): AuthServerAvailability => {
	let pausedUntil = 0;

	return {
		isPaused: () => Date.now() < pausedUntil,
		pause: () => {
			pausedUntil = Date.now() + pauseMs;
		}
	};
};

/** true when the token endpoint refused the grant (400 or 401), so the session is over */
export const isGrantRefused = (e: unknown): boolean =>
	e instanceof TokenEndpointError && (e.status === 400 || e.status === 401);
