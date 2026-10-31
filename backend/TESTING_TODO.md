# Testing TODO

This checklist is for the competitive coding platform. Each item is intentionally small so it can become one focused test.

Legend:

- `unit`: isolated class or function with mocked dependencies
- `e2e`: real HTTP request through the Nest application
- `integration`: real database or external service
- `realtime`: WebSocket or event-based behavior

## Users

- [ ] `testCreatingAUser` (`unit`): service calls `user.create` with the email and name.
- [ ] `testCreatingAUserThroughApi` (`e2e`): `POST /api/users` returns `201` and the created user.
- [ ] `testRejectingInvalidEmail` (`e2e`): invalid email returns `400`.
- [ ] `testRejectingEmptyName` (`e2e`): empty name returns `400`.
- [ ] `testRejectingLongName` (`e2e`): name over 100 characters returns `400`.
- [ ] `testFindingAUser` (`unit`): service calls `user.findUnique` with the user ID.
- [ ] `testGettingAUserThroughApi` (`e2e`): `GET /api/users/:id` returns the user.
- [ ] `testListingUsers` (`unit`): service requests users ordered by newest first.
- [ ] `testListingUsersThroughApi` (`e2e`): `GET /api/users` returns an array of users.
- [ ] `testUpdatingAUser` (`unit`): service calls `user.update` with the ID and changed data.
- [ ] `testUpdatingAUserThroughApi` (`e2e`): `PATCH /api/users/:id` returns the updated user.
- [ ] `testDeletingAUser` (`unit`): service calls `user.delete` with the user ID.
- [ ] `testDeletingAUserThroughApi` (`e2e`): `DELETE /api/users/:id` returns success.
- [ ] `testRejectingInvalidUserId` (`e2e`): non-UUID ID returns `400`.
- [ ] `testRejectingDuplicateEmail` (`integration`): duplicate email returns the chosen client error.

## Authentication

- [ ] `testRegisteringAUser` (`e2e`): registration returns a user without exposing a password.
- [ ] `testHashingAPassword` (`unit`): stored password differs from the plain password.
- [ ] `testLoggingInAUser` (`e2e`): valid credentials return a session or token.
- [ ] `testRejectingWrongPassword` (`e2e`): wrong password returns `401`.
- [ ] `testLoggingOutAUser` (`e2e`): logout invalidates the session or token.
- [ ] `testRejectingMissingToken` (`e2e`): protected route returns `401`.
- [ ] `testRejectingExpiredToken` (`e2e`): expired token returns `401`.
- [ ] `testPreventingUserImpersonation` (`e2e`): user cannot modify another user's protected data.

## Rooms

- [ ] `testCreatingARoom` (`e2e`): authenticated user can create a room.
- [ ] `testJoiningARoom` (`e2e`): player can join an open room.
- [ ] `testLeavingARoom` (`e2e`): player can leave a room.
- [ ] `testListingOpenRooms` (`e2e`): only joinable rooms are returned.
- [ ] `testFindingARoom` (`e2e`): valid room ID returns the room.
- [ ] `testUpdatingRoomSettings` (`e2e`): room owner can change settings.
- [ ] `testDeletingARoom` (`e2e`): room owner can delete the room.
- [ ] `testRejectingDuplicateRoomJoin` (`e2e`): joining the same room twice fails predictably.
- [ ] `testRejectingFullRoom` (`e2e`): joining a full room fails.
- [ ] `testRejectingInvalidRoomId` (`e2e`): malformed room ID returns `400`.
- [ ] `testPreventingUnauthorizedRoomUpdate` (`e2e`): non-owner cannot change settings.
- [ ] `testPreventingNonOwnerRoomDeletion` (`e2e`): non-owner cannot delete the room.

## Room Lifecycle

- [ ] `testStartingARoom` (`e2e`): owner can start a ready room.
- [ ] `testPreventingEarlyRoomStart` (`e2e`): room cannot start before its requirements are met.
- [ ] `testEndingARoom` (`e2e`): active room can be ended once.
- [ ] `testPreventingUnauthorizedRoomStart` (`e2e`): non-owner cannot start the room.
- [ ] `testNotifyingPlayersWhenRoomStarts` (`realtime`): all room clients receive a start event.
- [ ] `testNotifyingPlayersWhenRoomEnds` (`realtime`): all room clients receive an end event.
- [ ] `testHandlingPlayerDisconnect` (`realtime`): disconnected player leaves room state.
- [ ] `testReconnectingAPlayer` (`realtime`): reconnecting player receives current room state.

## Challenges

- [ ] `testCreatingAChallenge` (`e2e`): authorized user can create a challenge.
- [ ] `testFindingAChallenge` (`e2e`): valid challenge ID returns the challenge.
- [ ] `testListingChallenges` (`e2e`): challenge list returns available challenges.
- [ ] `testUpdatingAChallenge` (`e2e`): authorized owner can update a challenge.
- [ ] `testDeletingAChallenge` (`e2e`): authorized owner can delete a challenge.
- [ ] `testAssigningChallengeToRoom` (`e2e`): room receives the selected challenge.
- [ ] `testRejectingInvalidChallenge` (`e2e`): missing or invalid challenge data returns `400`.
- [ ] `testRejectingUnauthorizedChallengeUpdate` (`e2e`): unauthorized user receives `403`.

## Code Submission

- [ ] `testSubmittingCode` (`e2e`): player can submit code for the active challenge.
- [ ] `testRejectingEmptyCode` (`e2e`): empty code returns `400`.
- [ ] `testRejectingUnsupportedLanguage` (`e2e`): unsupported language returns `400`.
- [ ] `testRunningCodeAgainstTests` (`integration`): submitted code is executed against challenge tests.
- [ ] `testAcceptingCorrectCode` (`integration`): correct code produces an accepted result.
- [ ] `testRejectingIncorrectCode` (`integration`): incorrect output produces a rejected result.
- [ ] `testDetectingCompilationError` (`integration`): invalid source produces a compilation error result.
- [ ] `testDetectingRuntimeError` (`integration`): crashing source produces a runtime error result.
- [ ] `testDetectingTimeout` (`integration`): non-terminating source is stopped and marked timed out.
- [ ] `testLimitingSubmissionSize` (`e2e`): oversized code is rejected.
- [ ] `testPreventingUnsafeExecution` (`integration`): code cannot access unauthorized host resources.
- [ ] `testRecordingSubmissionResult` (`integration`): result, duration, and status are persisted.

## Competition Scoring

- [ ] `testCalculatingCompletionTime` (`unit`): score includes the expected elapsed time.
- [ ] `testCalculatingCharacterCount` (`unit`): score counts characters using the defined rule.
- [ ] `testCalculatingExecutionEfficiency` (`unit`): score uses the defined runtime or memory metric.
- [ ] `testRankingPlayersByTime` (`unit`): fastest valid submission ranks first.
- [ ] `testRankingPlayersByCharacters` (`unit`): shortest valid submission ranks first.
- [ ] `testRankingPlayersByEfficiency` (`unit`): most efficient valid submission ranks first.
- [ ] `testHandlingEqualScores` (`unit`): tied scores use the documented tie-breaker.
- [ ] `testUpdatingLeaderboardAfterSubmission` (`integration`): accepted submission changes rankings.
- [ ] `testFreezingScoresWhenRoomEnds` (`integration`): later submissions cannot change final rankings.

## Real-Time Features

- [ ] `testConnectingToRoomSocket` (`realtime`): authorized player connects successfully.
- [ ] `testRejectingUnauthorizedSocket` (`realtime`): unauthenticated socket connection is rejected.
- [ ] `testBroadcastingPlayerJoin` (`realtime`): existing players receive a join event.
- [ ] `testBroadcastingPlayerLeave` (`realtime`): remaining players receive a leave event.
- [ ] `testBroadcastingSubmissionStatus` (`realtime`): clients receive pending, running, and completed status.
- [ ] `testBroadcastingScoreUpdate` (`realtime`): clients receive the updated score.
- [ ] `testBroadcastingLeaderboardUpdate` (`realtime`): clients receive the new leaderboard.
- [ ] `testBroadcastingRoomStart` (`realtime`): clients receive the same start timestamp.
- [ ] `testBroadcastingRoomEnd` (`realtime`): clients receive the final results.
- [ ] `testHandlingDuplicateSocketConnection` (`realtime`): duplicate connection follows the chosen policy.
- [ ] `testHandlingDisconnectedSocket` (`realtime`): socket cleanup removes stale presence.
- [ ] `testPreventingMessagesFromOtherRooms` (`realtime`): room A cannot receive room B events.

## Concurrency

- [ ] `testPreventingDoubleRoomJoin` (`integration`): simultaneous joins do not exceed room capacity.
- [ ] `testPreventingDoubleSubmission` (`integration`): one request cannot create duplicate submissions.
- [ ] `testHandlingSimultaneousSubmissions` (`integration`): concurrent submissions receive independent results.
- [ ] `testKeepingLeaderboardConsistent` (`integration`): concurrent scores produce one valid ordering.
- [ ] `testPreventingSubmissionAfterRoomEnds` (`e2e`): ended room rejects new submissions.
- [ ] `testPreventingRoomStartRaceCondition` (`integration`): room starts only once.

## Database and Infrastructure

- [ ] `testApplyingMigrations` (`integration`): fresh database accepts all migrations.
- [ ] `testCreatingRequiredDatabaseTables` (`integration`): expected tables exist after migration.
- [ ] `testHandlingDatabaseUnavailable` (`integration`): API returns a controlled failure when database is down.
- [ ] `testHandlingDuplicateDatabaseRecord` (`integration`): unique constraint failure becomes the expected API error.
- [ ] `testHealthEndpoint` (`e2e`): health endpoint returns success.
- [ ] `testDatabaseHealthEndpoint` (`integration`): database health check detects database availability.

## Security

- [ ] `testRejectingMalformedJson` (`e2e`): malformed JSON returns `400`.
- [ ] `testRejectingUnknownFields` (`e2e`): unknown fields are removed or rejected according to policy.
- [ ] `testPreventingSqlInjection` (`e2e`): malicious input cannot alter a query.
- [ ] `testPreventingCodeInjection` (`integration`): submitted code cannot execute host commands.
- [ ] `testLimitingRequestRate` (`e2e`): excessive requests are throttled.
- [ ] `testPreventingOversizedRequest` (`e2e`): oversized request body is rejected.
- [ ] `testNotExposingPasswords` (`e2e`): responses never contain password data.
- [ ] `testNotExposingInternalErrors` (`e2e`): unexpected errors do not expose stack traces.

## Reusable Test Shapes

### Service unit test

```ts
it('creates a user', async () => {
  prisma.user.create.mockResolvedValue(user);

  await expect(service.create(input)).resolves.toEqual(user);

  expect(prisma.user.create).toHaveBeenCalledWith({ data: input });
});
```

### HTTP e2e test

```ts
it('creates a user through the API', () => {
  return request(app.getHttpServer())
    .post('/api/users')
    .send({ email: 'alice@example.com', name: 'Alice' })
    .expect(201);
});
```

### Rejected HTTP input

```ts
it('rejects invalid input', () => {
  return request(app.getHttpServer())
    .post('/api/users')
    .send({ email: 'invalid', name: '' })
    .expect(400);
});
```

### Real-time behavior

```ts
it('broadcasts a player join', async () => {
  // connect two clients, join one client, and assert the event on the other
});
```

## Suggested Order

1. Users unit tests.
2. User CRUD e2e tests.
3. DTO validation e2e tests.
4. Authentication tests.
5. Rooms and room lifecycle tests.
6. Challenge and submission tests.
7. Scoring and leaderboard tests.
8. Real-time event tests.
9. Concurrency, security, and infrastructure tests.
