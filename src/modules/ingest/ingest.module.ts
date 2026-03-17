import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { RuntimeDeviceKeyService } from '../../infra/runtime-auth/runtime-device-key.service';

@Module({
  // Ingest recebe leituras dos dispositivos e precisa do ConfigModule por causa da chave de ingestao.
  imports: [ConfigModule],
  controllers: [IngestController],
  providers: [IngestService, RuntimeDeviceKeyService]
})
export class IngestModule {}
