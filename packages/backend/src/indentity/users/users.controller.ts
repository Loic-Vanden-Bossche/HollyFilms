import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import UpdateMeDto from './dto/update.me.dto';
import { Role } from '../../shared/role';
import { Roles } from '../../shared/decorators/roles.decorator';
import { User } from '../../shared/decorators/user.decorator';
import { checkObjectId } from '../../shared/mongoose';
import CurrentUser from './current';
import UpdateTrackDto from './dto/update.track.dto';
import { dtoToTrackData } from '../../medias/medias.utils';
import GetPlayerStatusDto from './dto/get.playerStatus.dto';
import CreateProfileDto from './dto/create.profile.dto';
import { checkUniqueId } from '../auth/auth.utils';

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

  @Put('/me')
  @ApiOperation({ summary: '[User] Update self' })
  async updateMe(@User() user: CurrentUser, @Body() selfUpdate: UpdateMeDto) {
    return this.usersService.updateMe(user, selfUpdate);
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
}
