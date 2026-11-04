import type { Handle, RequestEvent } from '@sveltejs/kit';
import type {
	Context,
	Provider,
	AuthOptions,
	OAuthModule,
	SessionModule,
	RoutesModule,
	ChecksModule
} from '@leaguebrain/provenance';

/**
 * @param getDomain use event data to return a value for the session cookie's domain attributes
 * @param logging whether to log in handle routes (will use setting for \`dev\` if not provided)
 * @param options provide options to configure things like pathnames and cookie names (all fields are optional with sensible defaults)
 */
export type ProvenanceConfig = {
	getDomain?: (event: RequestEvent) => string | undefined;
	logging?: boolean;
	options?: AuthOptions;
};

declare function createContext<ProviderSession>(
	event: RequestEvent,
	modules: {
		oauth: OAuthModule;
		session: SessionModule<ProviderSession>;
		routes: RoutesModule;
		checks: ChecksModule<{ referrer?: string }>;
	},
	config: {
		logging: boolean;
		getDomain?: (event: RequestEvent) => string | undefined;
	}
): Context<ProviderSession, App.Session>;

/**
 * @param provider configuration for your OAuth provider ([see](@leaguebrain/provenance/providers/index.ts))
 * @param config optional extra configuration options for provenance behaviour
 * @returns an auth object with handle to be used in \`hooks.server.ts\` and \`protectRoute\` to redirect to login from \`+page.server.ts\` load functions if user is not authenticated
 */
export declare function provenance<ProviderSession>(
	provider: Provider<ProviderSession>,
	config?: ProvenanceConfig
): {
	handle: Handle;
	options: AuthOptions;
	createContext: (event: RequestEvent) => ReturnType<typeof createContext>;
};

declare global {
	namespace App {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface Session {}

		interface Locals {
			session: Session | null;
			/** true when the auth server did not answer, and the session (if any) was kept */
			authDegraded?: boolean;
		}
	}
}

export {};
