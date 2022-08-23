import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Role } from '../../shared/role';
import { Roles } from '../../shared/decorators/roles.decorator';
import { User } from '../../shared/decorators/user.decorator';
import { checkObjectId } from '../../shared/mongoose';
import CurrentUser from './current';
import UpdateTrackDto from './dto/update.track.dto';
import { dtoToTrackData, MediaType } from '../../medias/medias.utils';
import GetPlayerStatusDto from './dto/get.playerStatus.dto';
import CreateProfileDto from './dto/create.profile.dto';
import { checkUniqueId } from '../auth/auth.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.User)
  @Get('limited/:id')
  @ApiOperation({ summary: '[User] get user' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findByIdLimited(checkObjectId(id));
  }

  @Roles(Role.User)
  @Get('track')
  @ApiOperation({ summary: '[User] Set media track properties' })
  async setMediaCurrentTime(
    @User() user: CurrentUser,
    @Query() trackData: UpdateTrackDto,
  ) {
    return this.usersService.trackUser(user, dtoToTrackData(trackData));
  }

  @Roles(Role.User)
  @Get('insights/:uniqueId')
  @ApiOperation({ summary: '[User] Get profile insights' })
  async getProfileInsights(
    @User() user: CurrentUser,
    @Param('uniqueId') uniqueId: string,
  ) {
    return this.usersService.getProfileInsights(user, uniqueId);
  }

  @Roles(Role.User)
  @Delete('profile')
  @ApiOperation({ summary: '[User] Delete profile' })
  async deleteProfile(@User() user: CurrentUser) {
    return this.usersService.deleteProfile(user);
  }

  @Roles(Role.User)
  @Get('/profile/current')
  @ApiOperation({ summary: '[User] Set media track properties' })
  async getCurrentUserProfile(@User() user: CurrentUser) {
    return this.usersService.getProfile(user, 'current');
  }

  @Roles(Role.User)
  @Get('/addRequest/:mediaType/:tmdbId')
  @ApiOperation({ summary: '[User] Add a requested media' })
  async createAddRequest(
    @User() user: CurrentUser,
    @Param('mediaType') mediaType: MediaType,
    @Param('tmdbId') tmdbId: number,
  ) {
    if (mediaType !== 'movie' && mediaType !== 'tv') {
      throw new HttpException('Invalid media type', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.createAddRequest(user, mediaType, tmdbId);
  }

  @Roles(Role.User)
  @Get('/addToList/:mediaId')
  @ApiOperation({ summary: '[User] Add a media to profile list' })
  async addMediaToList(
    @User() user: CurrentUser,
    @Param('mediaId') mediaId: string,
  ) {
    return this.usersService.addMediaToList(user, mediaId);
  }

  @Roles(Role.User)
  @Get('/removeFromList/:mediaId')
  @ApiOperation({ summary: '[User] Remove media from profile list' })
  async removeMediaFromList(
    @User() user: CurrentUser,
    @Param('mediaId') mediaId: string,
  ) {
    return this.usersService.removeMediaFromList(user, mediaId);
  }

  @Roles(Role.User)
  @Get('/like/:mediaId')
  @ApiOperation({ summary: '[User] Like a media' })
  async likeMedia(
    @User() user: CurrentUser,
    @Param('mediaId') mediaId: string,
  ) {
    return this.usersService.likeMedia(user, mediaId);
  }

  @Roles(Role.User)
  @Get('/unlike/:mediaId')
  @ApiOperation({ summary: '[User] Unlike a media' })
  async unlikeMedia(
    @User() user: CurrentUser,
    @Param('mediaId') mediaId: string,
  ) {
    return this.usersService.unlikeMedia(user, mediaId);
  }

  @Roles(Role.User)
  @Get('/profile/:uniqueId')
  @ApiOperation({ summary: '[User] Set media track properties' })
  async getUserProfile(
    @User() user: CurrentUser,
    @Param('uniqueId') uniqueId: string,
  ) {
    return this.usersService.getProfile(user, checkUniqueId(uniqueId));
  }

  @Roles(Role.User)
  @Get('/profiles')
  @ApiOperation({ summary: '[User] Get all profiles of the user' })
  async getUserProfiles(@User() user: CurrentUser) {
    return this.usersService.getProfiles(user);
  }

  @Roles(Role.User)
  @Post('/profile')
  @ApiOperation({ summary: '[User] Create a new user profile' })
  async createUserProfile(
    @User() user: CurrentUser,
    @Body() profileDto: CreateProfileDto,
  ) {
    return this.usersService.createProfile(user, profileDto);
  }

  @Roles(Role.User)
  @Put('/profile/:uniqueId')
  @ApiOperation({ summary: '[User] Update a specific user profile' })
  async updateUserProfile(
    @User() user: CurrentUser,
    @Param('uniqueId') uniqueId: string,
    @Body() profileDto: CreateProfileDto,
  ) {
    return this.usersService.updateProfile(
      user,
      profileDto,
      checkUniqueId(uniqueId),
    );
  }

  @Roles(Role.User)
  @Get('playerStatus')
  @ApiOperation({ summary: '[User] Get current player status' })
  async getPlayerStatus(
    @User() user: CurrentUser,
    @Query() query: GetPlayerStatusDto,
  ) {
    return this.usersService.getPlayerStatus(
      user,
      query.mediaId,
      query.si ? parseInt(query.si) : undefined,
      query.ei ? parseInt(query.ei) : undefined,
    );
  }

  @Roles(Role.User)
  @Get('picture/:uniqueId/:hash')
  @ApiProduces('image/jpeg')
  @ApiOperation({ summary: '[User] Get profile picture from userId' })
  async profilePicture(
    @User() user: CurrentUser,
    @Param('uniqueId') uniqueId: string,
    @Param('hash') hash: string,
    @Res() res: Response,
  ) {
    res
      .set({ 'Content-Type': 'image/jpeg' })
      .send(await this.usersService.getProfilePicture(user, uniqueId, hash));
  }

  @Roles(Role.User)
  @Post('/profile-picture')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '[User] Upload a profile picture' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profilePicture'))
  uploadProfilePicture(
    @User() user: CurrentUser,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    const checkMime = (file: Express.Multer.File, types: string[]) =>
      types.includes(file.mimetype);

    if (
      profilePicture &&
      !checkMime(profilePicture, [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif',
        'image/webp',
      ])
    ) {
      throw new HttpException(
        'Bad profile picture file type detected, only jpeg, png, jpg, gif and webp are allowed',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersService.uploadProfilePicture(user, profilePicture);
  }
}
