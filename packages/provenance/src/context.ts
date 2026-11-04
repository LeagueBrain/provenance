import type { TokenRequestResult } from './tokens';

export type Context<ProviderSession, AppSession> = {
	oauth: {
		processAuthResponse: (expectedState: string) => {
			code: string;
			state: { referrer?: string };
		};
		requestToken: (codeVerifier: string, authorizationCode: string) => Promise<TokenRequestResult>;
		referrer: string | null;
		redirectLogin: (referrer: string | null) => Promise<void>;
		redirectSignup: (referrer: string | null) => Promise<void>;
		refresh: (
			refreshToken: string,
			options?: { signal?: AbortSignal }
		) => Promise<TokenRequestResult>;
		/** fetches `url`, such as the discovery document; true when the auth server answers */
		checkAuthServer: (options: { url: URL; timeout: number }) => Promise<boolean>;
		preLogout: (session: ProviderSession) => Promise<void>;
	};
	checks: {
		state: {
			use: () => string;
		};
		pkce: {
			use: () => string;
		};
	};
	session: {
		create: (tokens: TokenRequestResult) => ProviderSession;
		getCookie: () => ProviderSession | null;
		setCookie: (session: ProviderSession) => void;
		deleteCookie: () => void;
	};
	locals: {
		get session(): AppSession | null;
		set session(value: AppSession | null);
		/** true when the auth server did not answer, and the session (if any) was kept */
		get authDegraded(): boolean;
		set authDegraded(value: boolean);
	};
	routes: {
		redirect: (location: string | URL) => never;
		redirectUri: {
			is: boolean;
		};
		login: {
			redirect: () => never;
			is: boolean;
		};
		signup: {
			redirect: () => never;
			is: boolean;
		};
		logout: {
			redirect: () => never;
			is: boolean;
		};
		home: {
			redirect: () => never;
			is: boolean;
		};
	};
};
