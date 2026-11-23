import {
	BadGatewayException,
	Injectable,
	ServiceUnavailableException,
} from '@nestjs/common';

export type JudgeStatus =
	| 'accepted'
		| 'wrong_answer'
			| 'time_limit_exceeded'
				| 'compilation_error'
					| 'runtime_error'
						| 'internal_error';

						export interface ExecuteInput {
							sourceCode: string;
							languageId: number;
							stdin: string;
							cpuTimeLimit?: number;
							memoryLimit?: number;
						}

						export interface ExecuteResult {
							status: JudgeStatus;
							judgeStatusId: number;
							stdout: string | null;
							stderr: string | null;
							compileOutput: string | null;
							time: string | null;
							memory: number | null;
						}

						interface Judge0SubmissionResponse {
							stdout: string | null;
							stderr: string | null;
							compile_output: string | null;
							time: string | null;
							memory: number | null;
							status: { id: number; description: string };
						}

						function mapStatus(id: number): JudgeStatus {
							switch (id) {
								case 3:
									return 'accepted';
								case 4:
									return 'wrong_answer';
								case 5:
									return 'time_limit_exceeded';
								case 6:
									return 'compilation_error';
								case 13:
									return 'internal_error';
								default:
									return id >= 7 && id <= 12 ? 'runtime_error' : 'internal_error';
							}
						}

						@Injectable()
						export class JudgeService {
							private readonly baseUrl = process.env.JUDGE0_URL ?? 'http://judge0:2358';
							private readonly token = process.env.JUDGE0_AUTH_TOKEN ?? '';

							private headers() {
								return {
									'Content-Type': 'application/json',
									'X-Auth-Token': this.token,
								};
							}

							async execute(input: ExecuteInput): Promise<ExecuteResult> {
								let res: Response;
								try {
									res = await fetch(`${this.baseUrl}/submissions?base64_encoded=false&wait=true`, {
										method: 'POST',
										headers: this.headers(),
										body: JSON.stringify({
											source_code: input.sourceCode,
											language_id: input.languageId,
											stdin: input.stdin,
											cpu_time_limit: input.cpuTimeLimit ?? 2,
											memory_limit: input.memoryLimit ?? 256000,
										}),
									});
								} catch {
									throw new ServiceUnavailableException('Judge is unreachable');
								}

								if (!res.ok) {
									throw new BadGatewayException(`Judge returned HTTP ${res.status}`);
								}

								const data = (await res.json()) as Judge0SubmissionResponse;

								return {
									status: mapStatus(data.status.id),
									judgeStatusId: data.status.id,
									stdout: data.stdout,
									stderr: data.stderr,
									compileOutput: data.compile_output,
									time: data.time,
									memory: data.memory,
								};
							}

							matches(actual: string | null, expected: string): boolean {
								const normalize = (s: string) =>
								s.replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd()).join('\n').trimEnd();
								return normalize(actual ?? '') === normalize(expected);
							}

							async languages() {
								let res: Response;
								try {
									res = await fetch(`${this.baseUrl}/languages`, { headers: this.headers() });
								} catch {
									throw new ServiceUnavailableException('Judge is unreachable');
								}
								if (!res.ok) throw new BadGatewayException(`Judge returned HTTP ${res.status}`);
								return res.json();
							}
						}
