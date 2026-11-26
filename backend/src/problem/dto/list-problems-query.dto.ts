import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListProblemsQueryDto {
	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsIn(['title', 'difficulty', 'solveRate', 'status'])
	sortBy?: 'title' | 'difficulty' | 'solveRate' | 'status';

	@IsOptional()
	@IsIn(['asc', 'desc'])
	sortOrder?: 'asc' | 'desc';

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
