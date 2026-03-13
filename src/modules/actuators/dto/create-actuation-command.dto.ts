import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateActuationCommandDto {
  @IsString()
  @IsIn(['on', 'off'])
  desiredState: 'on' | 'off';

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
