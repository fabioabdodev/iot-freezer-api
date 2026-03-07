import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

