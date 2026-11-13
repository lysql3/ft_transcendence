import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  difficulty!: string;
}
