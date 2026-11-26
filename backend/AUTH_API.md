# Authentication API for the Frontend

This document describes the authentication endpoints the frontend can call. Better Auth is mounted under `/api/auth`; application-specific user endpoints are under `/api/users`.

## Base URLs and Cookies

In local development, the browser uses the frontend origin `http://localhost:5173`. Vite proxies `/api` requests to the backend at `http://localhost:3000`. In the containerized development stack, the Nginx gateway forwards browser requests to Vite.

The backend origin is configured by `BETTER_AUTH_URL`; the allowed frontend origin is configured by `FRONTEND_URL`. In production, use the public application/backend URLs configured for the deployment. Do not hardcode a production URL in the frontend.

Better Auth uses an HTTP-only session cookie. The browser should use the existing client from `frontend/src/features/auth/lib/authClient.ts`; direct `fetch` calls must use `credentials: "include"`. Do not store session tokens in local storage or send passwords to application-specific user endpoints.

## Active Endpoints

| Method | Endpoint | Purpose | Request |
| --- | --- | --- | --- |
| `POST` | `/api/auth/sign-up/email` | Create an email/password account | `{ "name": "Player", "username": "player1", "email": "player@example.com", "password": "..." }` |
| `POST` | `/api/auth/sign-in/email` | Sign in with email/password | `{ "email": "player@example.com", "password": "..." }` |
| `POST` | `/api/auth/sign-in/social` | Start social sign-in | Use Better Auth client with `{ "provider": "github", "callbackURL": "http://localhost:5173/" }` |
| `GET` | `/api/auth/get-session` | Read the current session | No body; called by `authClient.useSession()` |
| `POST` | `/api/auth/sign-out` | End the current session | No body; called by `authClient.signOut()` |
| `GET` | `/api/users/me` | Read the signed-in user and profile | Requires session cookie |
| `PATCH` | `/api/users/me` | Update the signed-in user's name | `{ "name": "New name" }`; requires session cookie |
| `DELETE` | `/api/users/me` | Delete the signed-in user's account | Requires session cookie |

The signup form currently sends `name` and `username` from its username field. The username plugin enforces a length of 3 to 20 characters. Email/password signup and signin are currently submitted as JSON with `credentials: "include"`; successful submission is followed by a session refetch.

`authClient.signIn.social()` handles the social redirect. For GitHub, the GitHub OAuth App's **Authorization callback URL** must be the backend callback, not the frontend `callbackURL`:

```text
http://localhost:3000/api/auth/callback/github
```

The frontend `callbackURL` is where Better Auth returns the browser after processing that callback. In production, register `<BETTER_AUTH_URL>/api/auth/callback/github` with GitHub and set `callbackURL` to an allowed frontend URL. GitHub OAuth is enabled only when both `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set. Google is shown in the current frontend UI but is not configured as a backend social provider yet.

The `GET /api/users/me` response has this shape:

```json
{
  "user": {
    "id": "user-id",
    "name": "Player",
    "email": "player@example.com",
    "profile": {
      "userId": "user-id",
      "bio": null,
      "elo": 1000
    }
  }
}
```

`profile` can be `null` if the account has no profile row. `PATCH /api/users/me` updates only `name`; although its response includes the profile relation, this route does not update profile fields. Unauthenticated requests to the user endpoints return `401 Unauthorized`.

## Password Recovery: Not Wired Yet

The forgot-password and reset-password pages are present, but their submit handlers are placeholders. The backend does not configure a reset-email sender, so do not treat recovery as ready for frontend integration. Better Auth's documented endpoints, once the backend configures `emailAndPassword.sendResetPassword` and email delivery, are:

| Method | Endpoint | Request |
| --- | --- | --- |
| `POST` | `/api/auth/request-password-reset` | `{ "email": "player@example.com", "redirectTo": "http://localhost:5173/reset-password" }` |
| `POST` | `/api/auth/reset-password` | `{ "newPassword": "...", "token": "token-from-reset-link" }` |
| `POST` | `/api/auth/change-password` | `{ "currentPassword": "...", "newPassword": "...", "revokeOtherSessions": true }` |

Use Better Auth's client methods (`requestPasswordReset`, `resetPassword`, and `changePassword`) rather than reimplementing token handling. Password reset links contain a one-time token; the reset page must read it from the URL and submit it with the new password. Email delivery and the UI handlers must be implemented before these flows are considered available.

## Secret Handling

The current `.env.example` contains a GitHub client secret temporarily for teammate setup. This is not a safe location: `.env.example` is intended to be committed, and the repository has already been pushed. Treat the current value as exposed and rotate/revoke it. As soon as the team can switch to a safer source, replace the example value with an empty placeholder and provide the credential through an ignored local `.env` or a deployment secret manager. Removing it from the latest file does not erase it from Git history; coordinate history cleanup if required. Never expose the client secret in a `VITE_*` variable or frontend bundle.

## Better Auth References

- [Email and password authentication](https://www.better-auth.com/docs/authentication/email-password)
- [OAuth and social sign-in](https://www.better-auth.com/docs/concepts/oauth)
- [Better Auth API concepts](https://www.better-auth.com/docs/concepts/api)
