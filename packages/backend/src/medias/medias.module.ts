import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './schemas/media.schema';
import { ProcessingModule } from '../processing/processing.module';
import { IdentityModule } from '../indentity/identity.module';

@Module({
  imports: [
    forwardRef(() => ProcessingModule),
    IdentityModule,
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  providers: [MediasService],
  controllers: [MediasController],
  exports: [MediasService],
})
export class MediasModule {}
