import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateSubmissionDto { // ilyass change userId type for authentification, so this file will be change later
  @IsInt()
  @Min(1)
  userId!: number;

  @IsInt()
  @Min(1)
  problemId!: number;

  @IsInt()
  @Min(1)
  languageId!: number;

  @IsString()
  @IsNotEmpty()
  codeContent!: string;
}
