import { Controller, Get, Headers, Param, Res } from '@nestjs/common';

import { AdminMedia, MediasService } from './medias.service';

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

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: '[User] Get all medias sorted by titles' })
  async getAllMedias(): Promise<MediaWithType[]> {
    return this.mediasService.getMedias();
  }

  @Get('mostPopular')
  @ApiOperation({ summary: '[User] Get all medias sorted by most populars' })
  async getMostPopular(): Promise<MediaWithType[]> {
    return this.mediasService.getMostPopular();
  }

  @Get('recommended')
  @ApiOperation({
    summary: '[User] Get all medias sorted by recommended for the current user',
  })
  async getRecommended(@User() user: CurrentUser): Promise<MediaWithType[]> {
    return this.mediasService.getRecommended(user);
  }

  @Get('continueToWatch')
  @ApiOperation({ summary: '[User] Get all not entirely watched' })
  async getContinueToWatch(
    @User() user: CurrentUser,
  ): Promise<MediaWithType[]> {
    return this.mediasService.getContinueToWatch(user);
  }

  @Get('seeAgain')
  @ApiOperation({ summary: '[User] Get all medias already seen' })
  async getSeeAgain(@User() user: CurrentUser): Promise<MediaWithType[]> {
    return this.mediasService.getSeeAgain(user);
  }

  @Get('search/:query')
  @ApiOperation({ summary: '[User] Search for medias' })
  async searchQuery(@Param('query') query: string): Promise<MediaWithType[]> {
    return this.mediasService.searchQuery(query);
  }

  @Get('adminSearch/:query')
  @ApiOperation({ summary: '[User] Search for medias in admin mode' })
  async adminSearchQuery(@Param('query') query: string): Promise<AdminMedia[]> {
    return this.mediasService.adminSearchQuerry(query);
  }

  @Roles(Role.Admin)
  @Get('randomBackdrop')
  @ApiOperation({ summary: '[Admin] Get a random movie backdrop' })
  async getRandomBackdrop(): Promise<{ path: string }> {
    return this.mediasService.getRandomBackdrop();
  }

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
