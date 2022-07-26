import { Module } from '@nestjs/common';
import { TmdbController } from './tmdb.controller';
import { TmdbService } from './tmdb.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TmdbController],
  providers: [TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}
