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

/**
 * true when the token endpoint refused the grant (400 or 401), so the session is over
 *
 * the check reads the error's name, not its class: an app can load two copies of this
 * package, and then `instanceof` fails for an error from the other copy
 */
export const isGrantRefused = (e: unknown): boolean =>
	e instanceof Error &&
	e.name === 'TokenEndpointError' &&
	'status' in e &&
	(e.status === 400 || e.status === 401);
