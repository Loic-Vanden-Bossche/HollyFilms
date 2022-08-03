import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Query,
  Res,
} from '@nestjs/common';

import { MediasService } from './medias.service';

import { Response } from 'express';
import { Roles } from '../shared/decorators/roles.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import CurrentUser from '../indentity/users/current';
import { Role } from '../shared/role';
import { MediaWithType } from './medias.utils';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Medias')
@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Roles(Role.User)
  @Get()
  @ApiOperation({ summary: '[User] Get all medias sorted by titles' })
  async getAllMedias(): Promise<MediaWithType[]> {
    return this.mediasService.getMedias();
  }

  @Roles(Role.Admin)
  @Get('adminSearch')
  @ApiOperation({ summary: '[User] Search for medias in admin mode' })
  async adminSearchQuery(
    @Query('query') query: string,
  ): Promise<MediaWithType[]> {
    return this.mediasService.adminSearchQuery(query);
  }

  @Roles(Role.User)
  @Get(':id')
  @ApiOperation({ summary: '[User] Get a specific media by id' })
  async getMedia(@Param('id') id: string) {
    return this.mediasService.getMedia(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete a specific media by id' })
  async deleteMedia(@Param('id') id: string) {
    return this.mediasService.deleteMedia(id);
  }

  @Roles(Role.User)
  @Get('mostPopular')
  @ApiOperation({ summary: '[User] Get all medias sorted by most populars' })
  async getMostPopular(): Promise<MediaWithType[]> {
    return this.mediasService.getMostPopular();
  }

  @Roles(Role.User)
  @Get('recommended')
  @ApiOperation({
    summary: '[User] Get all medias sorted by recommended for the current user',
  })
  async getRecommended(@User() user: CurrentUser): Promise<MediaWithType[]> {
    return this.mediasService.getRecommended(user);
  }

  @Roles(Role.User)
  @Get('continueToWatch')
  @ApiOperation({ summary: '[User] Get all not entirely watched' })
  async getContinueToWatch(
    @User() user: CurrentUser,
  ): Promise<MediaWithType[]> {
    return this.mediasService.getContinueToWatch(user);
  }

  @Roles(Role.User)
  @Get('seeAgain')
  @ApiOperation({ summary: '[User] Get all medias already seen' })
  async getSeeAgain(@User() user: CurrentUser): Promise<MediaWithType[]> {
    return this.mediasService.getSeeAgain(user);
  }

  @Roles(Role.User)
  @Get('search/:query')
  @ApiOperation({ summary: '[User] Search for medias' })
  async searchQuery(@Param('query') query: string): Promise<MediaWithType[]> {
    return this.mediasService.searchQuery(query);
  }

  @Roles(Role.Admin)
  @Get('randomBackdrop')
  @ApiOperation({ summary: '[Admin] Get a random movie or tv backdrop' })
  async getRandomBackdrop(): Promise<{ path: string }> {
    return this.mediasService.getRandomBackdrop();
  }

  @Roles(Role.User)
  @Get('stream/:location/*')
  @ApiOperation({ summary: '[User] Stream media file' })
  async getStream(
    @Param('location') location: string,
    @Param() path: string[],
    @Res() res: Response,
    @Headers('accept-encoding') encodingHeader: string,
  ): Promise<void> {
    return this.mediasService.getStream(res, location, path[0], encodingHeader);
  }
}
