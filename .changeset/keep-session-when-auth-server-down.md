---
'@leaguebrain/provenance': minor
---

keep the session when keycloak is briefly unreachable: a refresh drops the session only on a 400 or 401, times out after `refreshTimeout`, and on any other failure keeps the session, sets `locals.authDegraded` and pauses keycloak calls for `unavailablePause`. the login route checks keycloak first and renders the app's `/login` page with a 503 when keycloak does not answer, and a logout that cannot reach keycloak still ends the local session. add `forceLogin`, `TokenEndpointError` and `context.oauth.checkAuthServer`.
