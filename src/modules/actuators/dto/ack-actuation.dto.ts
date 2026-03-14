import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class AckActuationDto {
  @IsString()
  @IsIn(['on', 'off'])
  appliedState: 'on' | 'off';

  @IsOptional()
  @IsBoolean()
  success?: boolean;

  @IsOptional()
  @IsString()
  message?: string;
}
