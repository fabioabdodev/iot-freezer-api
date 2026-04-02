import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IsClientPhone } from '../../clients/client-contact.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  clientId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsClientPhone()
  phone?: string;

  @IsOptional()
  @IsIn(['admin', 'operator'])
  role?: 'admin' | 'operator';

  @IsOptional()
  @IsIn(['inherit', 'technical', 'client'])
  preferredLayout?: 'inherit' | 'technical' | 'client';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
