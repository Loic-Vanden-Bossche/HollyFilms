import { Controller, Get, Query } from '@nestjs/common';
import { SearchType, TmdbService } from './tmdb.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/role';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tmdb')
@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Roles(Role.User)
  @Get('search')
  @ApiOperation({ summary: '[Admin] Search in TMDB API for movies & tvs' })
  async searchQuerry(
    @Query('type') type: SearchType = 'both',
    @Query('query') query: string,
  ) {
    return this.tmdbService.searchQuery(query, type);
  }
}
