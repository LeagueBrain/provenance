---
'@leaguebrain/provenance': patch
---

sign a person out when keycloak refuses the refresh, instead of treating the refusal as an outage: each entry point held its own copy of `TokenEndpointError`, so the refresh check never matched an error from the token request. the build now shares one chunk between entry points, and the check reads the error's name and status
