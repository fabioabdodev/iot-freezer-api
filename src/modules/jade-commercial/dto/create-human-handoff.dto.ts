import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHumanHandoffDto {
  @IsString()
  @IsNotEmpty()
  leadPhone: string;

  @IsOptional()
  @IsString()
  leadName?: string;

  @IsOptional()
  @IsString()
  interestTopic?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  commercialIntent?: string;

  @IsOptional()
  @IsString()
  sourceStage?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}
