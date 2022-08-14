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
import { MediasQueryDto } from './dto/medias.query.dto';
import { SearchQueryDto } from './dto/search.query.dto';
import { checkObjectId } from '../shared/mongoose';
import { Public } from '../shared/decorators/public.decorator';

@ApiTags('Medias')
@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Roles(Role.User)
  @Get()
  @ApiOperation({ summary: '[User] Get all medias sorted by titles' })
  async getMedias(
    @User() user: CurrentUser,
    @Query() query: MediasQueryDto,
  ): Promise<MediaWithType[]> {
    return this.mediasService.getMedias(
      true,
      user,
      query.type,
      query.skip,
      query.limit,
    );
  }

  @Roles(Role.User)
  @Get('search')
  @ApiOperation({ summary: '[User] Get all medias corresponding to query' })
  async getSearchQuery(
    @Query() query: SearchQueryDto,
  ): Promise<MediaWithType[]> {
    return this.mediasService.searchQuery(query.query, true);
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
  @Get('featured')
  @ApiOperation({ summary: '[User] Get n of featured medias' })
  async getFeatured(@User() user: CurrentUser) {
    return this.mediasService.getFeatured(user);
  }

  @Public()
  @Get('showcase')
  @ApiOperation({ summary: '[User] Get all minified medias' })
  async getShowcase() {
    return this.mediasService.getShowcaseMedias();
  }

  @Roles(Role.User)
  @Get(':id')
  @ApiOperation({ summary: '[User] Get a specific media by id' })
  async getMedia(@Param('id') id: string) {
    return this.mediasService.getMedia(checkObjectId(id));
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete a specific media by id' })
  async deleteMedia(@Param('id') id: string) {
    return this.mediasService.deleteMedia(checkObjectId(id));
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
