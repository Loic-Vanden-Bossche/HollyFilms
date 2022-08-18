import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
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
