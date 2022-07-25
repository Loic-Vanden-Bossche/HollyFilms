import { Controller, Get, Headers, Param, Res } from '@nestjs/common';

import { AdminMedia, MediasService } from './medias.service';

import { Response } from 'express';
import { Roles } from '../shared/decorators/roles.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import CurrentUser from '../indentity/users/current';
import { Public } from '../shared/decorators/public.decorator';
import { Role } from '../shared/role';
import { MediaWithType } from './medias.utils';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Get()
  @Roles(Role.Admin)
  async getAllMedias(): Promise<MediaWithType[]> {
    return this.mediasService.getMedias();
  }

  @Get('mostPopular')
  async getMostPopular(): Promise<MediaWithType[]> {
    return this.mediasService.getMostPopular();
  }

  @Get('recommended')
  async getRecommended(@User() user: CurrentUser): Promise<MediaWithType[]> {
    return this.mediasService.getRecommended(user);
  }

  @Get('continueToWatch')
  async getContinueToWatch(
    @User() user: CurrentUser,
  ): Promise<MediaWithType[]> {
    return this.mediasService.getContinueToWatch(user);
  }

  @Get('seeAgain')
  async getSeeAgain(@User() user: CurrentUser): Promise<MediaWithType[]> {
    return this.mediasService.getSeeAgain(user);
  }

  @Get('search/:querry')
  async searchQuerry(
    @Param('querry') querry: string,
  ): Promise<MediaWithType[]> {
    return this.mediasService.searchQuerry(querry);
  }

  @Get('adminSearch/:querry')
  async adminSearchQuerry(
    @Param('querry') querry: string,
  ): Promise<AdminMedia[]> {
    return this.mediasService.adminSearchQuerry(querry);
  }

  @Roles(Role.Admin)
  @Get('randomBackdrop')
  async getRandomBackdrop(): Promise<{ path: string }> {
    return this.mediasService.getRandomBackdrop();
  }

  @Public()
  @Get('stream/:location/*')
  async getStream(
    @Param('location') location: string,
    @Param() path: string[],
    @Res() res: Response,
    @Headers('accept-encoding') encodingHeader: string,
  ): Promise<void> {
    return this.mediasService.getStream(res, location, path[0], encodingHeader);
  }
}
