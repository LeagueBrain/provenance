---
'@leaguebrain/provenance': patch
---

call keycloak with the global fetch instead of `event.fetch`, which adds an `Origin` header that keycloak refuses with a 403 `Invalid origin` when the client does not list the site in its web origins
