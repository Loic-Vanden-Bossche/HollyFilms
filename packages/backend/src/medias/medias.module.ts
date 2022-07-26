import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './schemas/media.schema';
import { ProcessingModule } from '../processing/processing.module';

@Module({
  imports: [
    forwardRef(() => ProcessingModule),
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  providers: [MediasService],
  controllers: [MediasController],
  exports: [MediasService],
})
export class MediasModule {}
