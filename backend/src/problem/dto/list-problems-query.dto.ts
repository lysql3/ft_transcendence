import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListProblemsQueryDto {
	@IsOptional()
	@IsIn(['easy', 'medium', 'hard'])
	difficulty?: string;

	@IsOptional()
	@IsString()
	tag?: string;

	@IsOptional()
	@Type(() => Number)
	@Min(1)
	page?: number = 1;

	@IsOptional()
	@Type(() => Number)
	@Min(1)
	@Max(100)
	limit?: number = 20;
}
