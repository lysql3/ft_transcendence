import { IsInt, IsString } from 'class-validator';

export class TestExecuteDto {
	@IsString()
	sourceCode: string;

	@IsInt()
	languageId: number;

	@IsString()
	stdin: string;
}
