import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class TemperatureDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  client_id?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  device_id: string;

  @Type(() => Number)
  @IsNumber()
  temperature: number;
}
