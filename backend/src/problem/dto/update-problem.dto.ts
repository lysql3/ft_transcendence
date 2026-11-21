import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProblemFieldsDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;
}
