import { Body, Controller, Get, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/role';
import { Media } from '../media.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaWithType } from '../medias.utils';
import { MovieTvDto } from './dto/movie.tv.dto';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @Roles(Role.User)
  @ApiOperation({ summary: '[User] Find all movies stored in database' })
  async getAll(): Promise<Media[]> {
    return this.moviesService.findAll();
  }

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: '[Admin] Add a movie in database from TMDB' })
  async add(@Body() body: MovieTvDto): Promise<MediaWithType> {
    return this.moviesService.add(body.tmdbId);
  }
}
