import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateSubmissionDto {
	@IsInt()
	problemId: number;

	@IsInt()
	languageId: number;

	@IsString()
	@MinLength(1)
	code: string;
}
