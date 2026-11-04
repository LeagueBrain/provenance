# @leaguebrain/provenance

## 0.15.1
### Patch Changes

- bf60f7a: call keycloak with the global fetch instead of `event.fetch`, which adds an `Origin` header that keycloak refuses with a 403 `Invalid origin` when the client does not list the site in its web origins

## 0.15.0
### Minor Changes

- c27025f: keep the session when keycloak is briefly unreachable: a refresh drops the session only on a 400 or 401, times out after `refreshTimeout`, and on any other failure keeps the session, sets `locals.authDegraded` and pauses keycloak calls for `unavailablePause`. the login route checks keycloak first and renders the app's `/login` page with a 503 when keycloak does not answer, and a logout that cannot reach keycloak still ends the local session. add `forceLogin`, `TokenEndpointError` and `context.oauth.checkAuthServer`.

## 0.14.0
### Minor Changes

- a71aa7d: add signup initiative and resolver with github and keycloak support
- f6498d7: rename package from `@tripleslate/provenance` to `@leaguebrain/provenance`; update your imports (including the `vite.config` plugin import) to the new name
- 8b357e0: support `vite` 8
- e4f4e63: export `modules` in package
- 9ef8c63: drop `@oslojs/*` dependencies in favor of built-in implementations (Web Crypto for PKCE); `context.oauth.redirectLogin` and `context.oauth.redirectSignup` are now async
- ae6ff7d: Security and bug fixes:
  
  - **Fix open redirect**: `referrer` values (from the `?referrer=` query param or oauth state) are now only honored when they are same-origin relative paths; absolute, protocol-relative, and backslash variants are ignored
  - Fix keycloak `validateSession` validating `accessExpiresAt` twice and never validating `refreshExpiresAt`
  - Fix `routes.home.is` checking the logout pathname instead of the home pathname (both runtimes)
  - Add missing `signupPathname` and `refreshPathname` to the `AuthOptions` type
  - The `refresh` initiative now updates `locals.session` after refreshing (and clears it on failure), matching the refresh resolver
  - Vite plugin: fix the `node_modules` walk-up search (it previously threw on the first missing candidate), await runtime generation in `buildStart`/`configureServer`, and create the output directory recursively
  - Reconcile drift between the hand-maintained ts and js runtimes: removed the leftover `sessionCallback` config from the js runtime (dropped from the ts runtime and the published types long ago), the js runtime's logout redirect now carries the `referrer` param like the ts runtime, and log labels/returns now match
  - Only cookies with a numeric chunk suffix (e.g. `session-0`) are treated as session chunks, so unrelated cookies sharing the prefix no longer corrupt or get deleted with the session
  - Throw `Error` objects instead of strings throughout, preserving stack traces in logged errors
- 3ef093e: support `vite` 7

### Patch Changes

- a71aa7d: properly export login/logout initiatives

## 0.14.0-next.5
### Minor Changes

- 9ef8c63: drop `@oslojs/*` dependencies in favor of built-in implementations (Web Crypto for PKCE); `context.oauth.redirectLogin` and `context.oauth.redirectSignup` are now async

## 0.14.0-next.4
### Minor Changes

- 8b357e0: support `vite` 8
- ae6ff7d: Security and bug fixes:
  
  - **Fix open redirect**: `referrer` values (from the `?referrer=` query param or oauth state) are now only honored when they are same-origin relative paths; absolute, protocol-relative, and backslash variants are ignored
  - Fix keycloak `validateSession` validating `accessExpiresAt` twice and never validating `refreshExpiresAt`
  - Fix `routes.home.is` checking the logout pathname instead of the home pathname (both runtimes)
  - Add missing `signupPathname` and `refreshPathname` to the `AuthOptions` type
  - The `refresh` initiative now updates `locals.session` after refreshing (and clears it on failure), matching the refresh resolver
  - Vite plugin: fix the `node_modules` walk-up search (it previously threw on the first missing candidate), await runtime generation in `buildStart`/`configureServer`, and create the output directory recursively
  - Reconcile drift between the hand-maintained ts and js runtimes: removed the leftover `sessionCallback` config from the js runtime (dropped from the ts runtime and the published types long ago), the js runtime's logout redirect now carries the `referrer` param like the ts runtime, and log labels/returns now match
  - Only cookies with a numeric chunk suffix (e.g. `session-0`) are treated as session chunks, so unrelated cookies sharing the prefix no longer corrupt or get deleted with the session
  - Throw `Error` objects instead of strings throughout, preserving stack traces in logged errors

## 0.14.0-next.3
### Minor Changes

- 3ef093e: support `vite` 7

## 0.14.0-next.2
### Minor Changes

- e4f4e63: export `modules` in package

## 0.14.0-next.1
### Minor Changes

- a71aa7d: add signup initiative and resolver with github and keycloak support

### Patch Changes

- a71aa7d: properly export login/logout initiatives

## 0.14.0-next.0
### Minor Changes

- 6dda59e: support `vite` 6

## 0.13.0
### Minor Changes

- b689d9a: rename `Context['postlogout']` to `preLogout` and change signature
- 72783ba: throw errors as strings
- 72783ba: record expiry in ms
- b874a11: use 302 redirect instead of 303
- b874a11: always use `{sessionCookieName}-` pattern when parsing cookies

### Patch Changes

- 02018ac: move `vite/runtime` into `vite/sveltekit/runtime` to allow installation to depend on framework
- 2c9024e: improve provider session validation

## 0.13.0-next.2
### Patch Changes

- 2c9024e: improve provider session validation

## 0.13.0-next.1
### Minor Changes

- b874a11: use 302 redirect instead of 303
- b874a11: always use `{sessionCookieName}-` pattern when parsing cookies

## 0.13.0-next.0
### Minor Changes

- b689d9a: rename `Context['postlogout']` to `preLogout` and change signature
- 72783ba: throw errors as strings
- 72783ba: record expiry in ms

### Patch Changes

- 02018ac: move `vite/runtime` into `vite/sveltekit/runtime` to allow installation to depend on framework

## 0.12.0
### Minor Changes

- 2a7f79c: delete session cookies more aggressively and add initiative for doing so

## 0.11.0
### Minor Changes

- 254b958: remove untrustworthy `sessionCallback` from config/session resolution

## 0.10.0
### Minor Changes

- b2e318a: add scopes to provider configurations

### Patch Changes

- b2e318a: use `oslojs` instead of `oauth4webapi`

## 0.9.1
### Patch Changes

- 4a868d8: remove last traces of last path cookie

## 0.9.0
### Minor Changes

- 510c2d1: add login and logout initiatives
- 2488952: use oauth state to store referring url instead of last path cookie
- df979a3: remove keycloak provider session field `refreshExpiresIn` in favor of `refreshExpiresAt`

### Patch Changes

- df979a3: kill session in refresh resolver also if refresh token in cookie is expired
- 2488952: handle search params in referring page

## 0.8.4
### Patch Changes

- 1e831b4: set new session in locals in refresh resolver

## 0.8.3
### Patch Changes

- 4ebcb95: destroy broken cookie(s) if context `getCookie` throws
- 6968b48: unset session in locals when deleting the session cookie(s) (refresh failure, logout)

## 0.8.2
### Patch Changes

- 10734d5: post keycloak session logout before deleting session cookie and redirecting

## 0.8.1
### Patch Changes

- 0a91016: dont use global `Buffer` for state encode if not available

## 0.8.0
### Minor Changes

- 60bd535: add initiatives concept
- 60bd535: add `eagerRefresh` option to keycloak provider/refresh resolver

## 0.7.2

### Patch Changes

- cdd8de9: add a lot more logging and straighten up config types

## 0.7.1

### Patch Changes

- 84dd9c8: allow `getDomain` to return undefined

## 0.7.0

### Minor Changes

- 31b61c2: copy the runtime from src instead of writing a string to a file and add `getDomain` to runtime `provenance` config parameter

## 0.6.0

### Minor Changes

- 2b71a5e: remove `SessionExtra`/required `sessionCallback` and refactor for cleaner generics

## 0.5.3

### Patch Changes

- fe8d66b: bump deps

## 0.5.2

### Patch Changes

- add `postUpdateRun` option for formatting, etc.

## 0.5.1

### Patch Changes

- fix types agreement on context generic for SessionExtra stuff

## 0.5.0

### Minor Changes

- 352e38c: refactor: generate ts runtime inside lib with options

### Patch Changes

- 06d8824: fix: handle cookie checks failure with redirect (retry)

## 0.4.1

### Patch Changes

- fix vite config wrong `Plugin` type

## 0.4.0

### Minor Changes

- 2e38ebe: support SvelteKit v2

## 0.3.0

### Minor Changes

- 9dd6a99: remove last path resolver and save last path to cookies in `protectRoute`

### Patch Changes

- b9076fe: feat: add dedent to better format generated code

## 0.2.0

### Minor Changes

- 3ebc8e5: compress the `Provider` type and clean up type exports
- 3ebc8e5: change create provider (`github`, `keycloak`) signature and add type

### Patch Changes

- 3ebc8e5: add `fixSession` callback to providers

## 0.2.0-next.0

### Minor Changes

- 3ebc8e5: compress the `Provider` type and clean up type exports
- 3ebc8e5: change create provider (`github`, `keycloak`) signature and add type

### Patch Changes

- 3ebc8e5: add `fixSession` callback to providers

## 0.1.2

### Patch Changes

- 3f218da: add build to prepublish (to build the new version of the package.. disregard `0.1.1`` release)

## 0.1.1

### Patch Changes

- a7cc56e: add optional `sessionCookieAge` callback to user facing provider functions

## 0.1.0

### Minor Changes

- 7cd9720: initial release
