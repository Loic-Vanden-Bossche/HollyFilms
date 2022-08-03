import { forwardRef, Module } from '@nestjs/common';
import { ProcessingGateway } from './processing.gateway';
import { ProcessingService } from './processing.service';
import { ProcessingController } from './processing.controller';
import { WebsocketService } from './websocket.service';
import { ScrapperService } from './scrapper.service';
import { MediasModule } from '../medias/medias.module';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { QueuedProcess, QueuedProcessSchema } from './queued-process.schema';

@Module({
  imports: [
    forwardRef(() => MediasModule),
    HttpModule,
    MongooseModule.forFeature([
      { name: QueuedProcess.name, schema: QueuedProcessSchema },
    ]),
  ],
  controllers: [ProcessingController],
  providers: [
    ProcessingGateway,
    ProcessingService,
    WebsocketService,
    ScrapperService,
  ],
  exports: [ProcessingService],
})
export class ProcessingModule {}
