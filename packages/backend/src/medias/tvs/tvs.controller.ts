import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TvsService } from './tvs.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/role';
import { Media } from '../schemas/media.schema';

@Controller('tvs')
export class TvsController {
  constructor(private readonly tvsService: TvsService) {}

  @Get()
  @Roles(Role.User)
  async getAll(): Promise<Media[]> {
    return this.tvsService.findAll();
  }

  @Get(':id/add/:si')
  @Roles(Role.Admin)
  async addTvSeason(
    @Param('id') id: string,
    @Param('si') seasonIndex: number,
  ): Promise<Media> {
    return this.tvsService.addSeason(id, seasonIndex);
  }

  @Post(':id/add/:si/:ei')
  @Roles(Role.Admin)
  async addTvEpisode(
    @Param('id') id: string,
    @Param('si') seasonIndex: number,
    @Param('ei') episodeIndex: number,
    @Body('filePath') filePath: string,
  ): Promise<void> {
    return this.tvsService.addEpisode(id, seasonIndex, episodeIndex, filePath);
  }
}
