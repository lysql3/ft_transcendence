# Workflow

1. Pull latest main: `git switch main && git pull`
2. Branch: `git switch -c <type>/<feature-id>-<short-name>`
   - types: `feat`, `fix`, `chore`, `docs`
   - example: `feat/2.4-login-jwt`
3. Commit small and often. Message format: `type: short description`
   - example: `feat: add refresh token endpoint`
4. Push and open a PR into `main`. Fill in the template.
5. Another team member reviews. The author does not approve their own PR.
6. Resolve all comments, then squash-merge. Delete the branch.

# Rules

- Never commit to `main` directly.
- Never commit `.env`. Add new variables to `.env.example`.
- One feature = one PR. Keep PRs under ~400 lines when possible.
- If you change the Prisma schema, tell the group first. One person at a time, merge it before anyone else touches it.
- Review within 24h. If you're blocked, ask in the group chat.
- Reviewer: pull the branch and run it at least once. Reading the diff alone is not a review.

# Logging

Application logs are JSON objects with this schema:

- `timestamp`: ISO-8601 timestamp for the log entry
- `level`: log severity, such as `info`, `warn`, or `error`
- `service`: service name, normally `backend`
- `requestId`: identifier for the request, also returned in `X-Request-Id`
- `userId`: authenticated user identifier when available, otherwise `null`

Never log:

- Cookies or `Set-Cookie` headers
- `Authorization` headers
- Passwords
- TOTP codes
- Session tokens
- Submitted source code

The backend logger redacts cookie, `Set-Cookie`, and `Authorization` headers automatically. Application code must still avoid logging sensitive values directly.

```ts
import { Logger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(private readonly logger: Logger) {}

  createUser(userId: string) {
    this.logger.info({ userId }, 'User created');
  }
}
```
```ts
this.logger.debug({ data }, 'Debug information');
this.logger.info({ userId }, 'User created');
this.logger.warn({ userId }, 'Unexpected condition');
this.logger.error({ err }, 'Operation failed');
```
```ts
this.logger.info(
  {
    userId,
    roomId,
    submissionId,
  },
  'Submission completed',
);
```
