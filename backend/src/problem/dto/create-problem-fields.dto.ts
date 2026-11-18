// src/problem/dto/create-problem-fields.dto.ts
import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsIn,
	IsOptional,
	IsString,
	Matches,
	MinLength,
	ValidateNested,
} from 'class-validator';

export class TestCaseFieldsDto {
	@IsString()
	input: string;

	@IsString()
	expectedOutput: string;

	@IsOptional()
	@IsBoolean()
	isHidden?: boolean;
}

export class CreateProblemFieldsDto {
	@IsString()
	@MinLength(3)
	title: string;

	@IsString()
	@Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
		message: 'slug must be lowercase letters, digits and hyphens (e.g. two-sum)',
	})
	slug: string;

	@IsIn(['easy', 'medium', 'hard'])
	difficulty: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];

	@IsString()
	@MinLength(1)
	description: string;

	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => TestCaseFieldsDto)
	testCases: TestCaseFieldsDto[];
}
