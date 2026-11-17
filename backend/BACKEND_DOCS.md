# Backend Architecture

## Scope

The backend is a NestJS application with these responsibilities:

- Expose REST endpoints under the `/api` prefix.
- Authenticate requests with Better Auth.
- Apply authorization to resources owned by a user.
- Execute business logic in services.
- Persist data through Prisma and PostgreSQL.
- Provide health checks and structured logging.
- Provide the initial Socket.IO gateway for future realtime features.

The backend does not currently implement rooms, matchmaking, judging, or live
gameplay. The database contains models for those future features, but their
controllers and services have not been implemented yet.

## Runtime Flow

```text
HTTP request
  -> NestJS middleware and Better Auth global guard
  -> controller
  -> DTO validation
  -> service
  -> PrismaService
  -> PostgreSQL
  -> HTTP response
```

The application is created in `src/main.ts`:

```ts
const app = await NestFactory.create(AppModule, {
  bufferLogs: true,
  bodyParser: false,
});

app.setGlobalPrefix('api');
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
```

`bodyParser: false` is intentional because the Better Auth Nest adapter owns
the body parser for its authentication routes.

## Module Structure

```text
src/
  app.module.ts       Root module
  main.ts             Application bootstrap
  auth.ts             Better Auth instance
  prisma/             Prisma client and database lifecycle
  health/             Database health endpoint
  users/              User and profile endpoints
  events/             Socket.IO gateway
  generated/prisma/   Generated Prisma client
```

The root module composes the application modules:

```ts
@Module({
  imports: [
    HealthModule,
    PrismaModule,
    UsersModule,
    EventsModule,
    LoggerModule.forRoot(loggerConfig),
    AuthModule.forRoot({ auth }),
  ],
})
export class AppModule {}
```

## Authentication and Route Protection

`AuthModule.forRoot({ auth })` registers the Better Auth routes and a global
`AuthGuard` by default. Therefore, a controller route is authenticated unless
it explicitly opts out with `@AllowAnonymous()` or `@OptionalAuth()`.

The guard:

1. Reads the session from the request headers or cookies.
2. Attaches the session and user to the request.
3. Rejects unauthenticated requests with `401 Unauthorized`.
4. Allows public routes marked with `@AllowAnonymous()`.
5. Allows missing sessions only for routes marked with `@OptionalAuth()`.

The Better Auth configuration requires a stable secret:

```ts
const betterAuthSecret = process.env.BETTER_AUTH_SECRET;

if (!betterAuthSecret) {
  throw new Error('BETTER_AUTH_SECRET is required');
}

export const auth = betterAuth({
  secret: betterAuthSecret,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  trustedOrigins: [process.env.FRONTEND_URL ?? 'http://localhost:5173'],
});
```

The secret must be stable. Changing it invalidates existing sessions.

## Route Protection Policy

### Public Routes

These routes do not require a session because they are needed for service
discovery and infrastructure checks:

```ts
@Controller('health')
@AllowAnonymous()
export class HealthController {}
```

The root and `whoami` routes are also explicitly public:

```ts
@Controller()
@AllowAnonymous()
export class AppController {}
```

Current public routes:

```text
GET /api
GET /api/health
GET /api/whoami
GET /api/users/public
```

### Optional Authentication

`GET /api/users/optional` can be called without a session and reports whether
the caller is authenticated:

```ts
@Get('optional')
@OptionalAuth()
getOptional(@Session() session: UserSession) {
  return { authenticated: !!session };
}
```

### Authenticated Routes

The following routes require an active session through the global guard:

```text
GET    /api/users
GET    /api/users/me
GET    /api/users/:id
GET    /api/users/:id/profile
PATCH  /api/users/:id
PATCH  /api/users/:id/profile
DELETE /api/users/:id
```

`@Session()` provides the authenticated session to a controller method:

```ts
@Get('me')
getCurrentUser(@Session() session: UserSession) {
  return { user: session.user };
}
```

## Authentication Versus Authorization

Authentication proves who the caller is. Authorization decides whether that
caller may access the requested resource.

The global guard handles authentication, but it does not automatically ensure
that a URL parameter belongs to the current user. User mutation routes perform
that ownership check explicitly:

```ts
@Patch(':id/profile')
updateProfile(
  @Param('id') id: string,
  @Body() data: UpdateProfileDto,
  @Session() session: UserSession,
) {
  this.assertOwnUser(id, session);
  return this.usersService.updateProfile(id, data);
}
```

The controller rejects cross-user mutations with `403 Forbidden`:

```ts
private assertOwnUser(id: string, session: UserSession) {
  if (session.user.id !== id) {
    throw new ForbiddenException(
      'You can only modify your own user account',
    );
  }
}
```

This check currently applies to:

- `PATCH /api/users/:id`
- `PATCH /api/users/:id/profile`
- `DELETE /api/users/:id`

Future admin routes should use Better Auth roles or permissions rather than
trusting a user ID supplied by the client.

## Users Module

The users controller handles HTTP concerns and delegates persistence to the
users service:

```ts
@Patch(':id')
update(
  @Param('id') id: string,
  @Body() data: UpdateUserDto,
  @Session() session: UserSession,
) {
  this.assertOwnUser(id, session);
  return this.usersService.update(id, data);
}
```

The service owns Prisma operations:

```ts
update(id: string, data: UpdateUserDto) {
  return this.prisma.user.update({ where: { id }, data });
}
```

DTOs are validated by the global `ValidationPipe`. Unknown properties are
removed because `whitelist: true` is enabled.

## Database Layer

`PrismaModule` provides a shared `PrismaService`. The service uses the
PostgreSQL connection string from `DATABASE_URL` and is injected into feature
services.

The current schema contains users, profiles, problems, test cases, languages,
matches, submissions, sessions, accounts, and verification records. Only the
health and users features currently have application-level endpoints.

Database changes must be made through Prisma migrations:

```bash
cd backend
npm run prisma:migrate:dev
npm run prisma:generate
```

Production uses:

```bash
npm run prisma:migrate:deploy
```

## WebSocket Boundary

The Socket.IO gateway is registered through `EventsModule` and currently
supports only a `ping` message. The Better Auth global guard supports HTTP and
WebSocket contexts, so future game events must authenticate the socket before
joining rooms or accepting commands.

Current gateway behavior:

```ts
@SubscribeMessage('ping')
handlePing(@ConnectedSocket() client: Socket, @MessageBody() data?: unknown) {
  return {
    event: 'pong',
    data: {
      timestamp: new Date().toISOString(),
      clientData: data,
    },
  };
}
```

Future room and match events must apply authorization at the room boundary;
being authenticated must not automatically grant access to every room.

## Testing and Verification

Run backend unit tests:

```bash
cd backend
npm test
```

Run E2E tests:

```bash
npm run test:e2e
```

Run type checking without writing build artifacts:

```bash
npx tsc --noEmit --incremental false
```

Verify route protection manually:

```bash
curl -i http://localhost:3000/api/health
curl -i http://localhost:3000/api/users/me
curl -i http://localhost:3000/api/users
```

The first request should be public. The user requests should return
`401 Unauthorized` without a valid Better Auth session.

With a valid session cookie:

```bash
curl -i -b cookies.txt http://localhost:3000/api/users/me
```

Cross-user mutation tests must verify that an authenticated user receives
`403 Forbidden` when changing or deleting another user's resource.

## Current Limitations

- GitHub OAuth is not configured yet.
- SMTP email delivery is not configured yet.
- Problem, language, match, and submission controllers are not implemented.
- WebSocket authentication and room authorization still need integration tests.
- User listing privacy and pagination still need refinement.
- CORS is currently broader than production should allow.
