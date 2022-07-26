import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './schemas/media.schema';
import { ProcessingModule } from '../processing/processing.module';
import { IdentityModule } from '../indentity/identity.module';
import { TvsService } from './tvs/tvs.service';
import { TvsController } from './tvs/tvs.controller';
import { HttpModule } from '@nestjs/axios';
import { TmdbModule } from '../tmdb/tmdb.module';

@Module({
  imports: [
    forwardRef(() => ProcessingModule),
    IdentityModule,
    HttpModule,
    TmdbModule,
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  providers: [MediasService, TvsService],
  controllers: [MediasController, TvsController],
  exports: [MediasService],
})
export class MediasModule {}
