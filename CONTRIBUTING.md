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
