/**
 * wraps the JSON body of an OAuth 2.0 token endpoint response (RFC 6749 section 5)
 */
export class TokenRequestResult {
	body: object;

	constructor(body: object) {
		this.body = body;
	}

	private string(field: string): string | undefined {
		const value = (this.body as Record<string, unknown>)[field];
		return typeof value === 'string' ? value : undefined;
	}

	private requireString(field: string): string {
		const value = this.string(field);
		if (value === undefined) {
			throw new Error(`Missing or invalid '${field}' field`);
		}
		return value;
	}

	hasErrorCode(): boolean {
		return this.string('error') !== undefined;
	}

	errorCode(): string {
		return this.requireString('error');
	}

	hasErrorDescription(): boolean {
		return this.string('error_description') !== undefined;
	}

	errorDescription(): string {
		return this.requireString('error_description');
	}

	hasErrorURI(): boolean {
		return this.string('error_uri') !== undefined;
	}

	errorURI(): string {
		return this.requireString('error_uri');
	}

	hasState(): boolean {
		return this.string('state') !== undefined;
	}

	state(): string {
		return this.requireString('state');
	}

	tokenType(): string {
		return this.requireString('token_type');
	}

	accessToken(): string {
		return this.requireString('access_token');
	}

	accessTokenExpiresInSeconds(): number {
		const value = (this.body as Record<string, unknown>).expires_in;
		if (typeof value !== 'number') {
			throw new Error(`Missing or invalid 'expires_in' field`);
		}
		return value;
	}

	accessTokenExpiresAt(): Date {
		return new Date(Date.now() + this.accessTokenExpiresInSeconds() * 1000);
	}

	hasRefreshToken(): boolean {
		return this.string('refresh_token') !== undefined;
	}

	refreshToken(): string {
		return this.requireString('refresh_token');
	}

	hasScopes(): boolean {
		return this.string('scope') !== undefined;
	}

	scopes(): string[] {
		return this.requireString('scope').split(' ');
	}
}

/**
 * the token endpoint answered with an error, or with a body that is not a token response
 *
 * `status` is the http status, so a caller can tell a refused grant (400, 401) from an auth
 * server that is down (5xx, 429)
 */
export class TokenEndpointError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'TokenEndpointError';
		this.status = status;
	}
}
