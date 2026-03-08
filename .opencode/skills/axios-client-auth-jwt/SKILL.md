---
name: axios-client-auth-jwt
description: Enforce JWT access-refresh interceptor flow with retry and session-failure handling
---

## Required flow
1. Attach `accessToken` to outgoing requests.
2. On expired/invalid access token, call refresh endpoint with `refreshToken`.
3. If refresh succeeds, persist new token(s) and retry original request.
4. If refresh fails, clear session and redirect to login.
5. Prevent concurrent refresh storms (single-flight lock/queue).
