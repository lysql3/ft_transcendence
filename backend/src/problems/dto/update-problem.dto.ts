import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProblemDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  difficulty?: string;
}
