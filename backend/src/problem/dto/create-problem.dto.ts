import { IsString } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  path: string;
}
