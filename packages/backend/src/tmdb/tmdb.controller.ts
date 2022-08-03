import {Controller, Get, Param, Query} from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/role';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tmdb')
@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Roles(Role.Admin)
  @Get('search')
  @ApiOperation({ summary: '[Admin] Search in TMDB API for movies & tvs' })
  async searchQuerry(@Query('query') query: string) {
    return this.tmdbService.searchQuery(query);
  }
}
