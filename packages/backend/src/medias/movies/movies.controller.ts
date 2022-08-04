import { Body, Controller, Get, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/role';
import { Media } from '../media.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaWithTypeAndQueue } from '../medias.utils';
import { AddMovieDto } from './dto/add.movie.dto';

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
  async add(@Body() body: AddMovieDto): Promise<MediaWithTypeAndQueue> {
    return this.moviesService.add(body.tmdbId, body.filePath);
  }
}
