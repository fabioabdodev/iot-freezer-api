import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class ReadingDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  client_id?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  device_id: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9_]{3,50}$/)
  sensor_type: string;

  @Type(() => Number)
  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_%/-]{1,20}$/)
  unit?: string;
}
