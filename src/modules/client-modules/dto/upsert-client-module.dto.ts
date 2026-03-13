import { IsBoolean, IsIn, IsString, Matches } from 'class-validator';

export class UpsertClientModuleDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  clientId: string;

  @IsString()
  @IsIn(['temperature', 'actuation'])
  moduleKey: 'temperature' | 'actuation';

  @IsBoolean()
  enabled: boolean;
}
