import { Controller, Get, Param } from '@nestjs/common';
import { TmdbService } from './tmdb.service';

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('search/:querry')
  async searchQuerry(@Param('querry') querry: string): Promise<any[]> {
    return this.tmdbService.searchQuerry(querry);
  }
}
