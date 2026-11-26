import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RunCodeDto {
	@IsInt()
	languageId: number;

	@IsString()
	@MinLength(1)
	@MaxLength(65536)
	code: string;

	@IsOptional()
	@IsString()
	@MaxLength(10000)
	stdin?: string;
}
