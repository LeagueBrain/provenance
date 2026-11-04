import type { SerializeOptions } from 'cookie';
import { TokenEndpointError, TokenRequestResult } from './tokens';
export { TokenEndpointError, TokenRequestResult };

export type Cookie = {
	name: string;
	value: string;
	options: SerializeOptions & { path: string };
};

export type Cookies = {
	get: (name: string) => string | undefined;
	delete: (
		name: string,
		opts: SerializeOptions & {
			path: string;
		}
	) => void;
};

export type AuthOptions = {
	/** defaults to `/auth` */
	redirectUriPathname?: string;
	/** defaults to `session` */
	sessionCookieName?: string;
	/** defaults to `/login` */
	loginPathname?: string;
	/** defaults to `/signup` */
	signupPathname?: string;
	/** defaults to `/logout` */
	logoutPathname?: string;
	/** defaults to `/refresh` */
	refreshPathname?: string;
	/** defaults to `/` */
	homePathname?: string;
};

export type * from './context';
export type * from './modules';
export type * from './providers';
export type * from './resolvers';
