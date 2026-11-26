import { IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message: 'username must be 3-20 characters: letters, digits or underscore',
  })
  username?: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}
