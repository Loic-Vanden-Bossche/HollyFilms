import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import UpdateMeDto from './dto/update.me.dto';
import { Role } from '../../shared/role';
import { Roles } from '../../shared/decorators/roles.decorator';
import { User } from '../../shared/decorators/user.decorator';
import { checkObjectId } from '../../shared/mongoose';
import CurrentUser from './current';
import UpdateMeMediaPlayedTimeDto from './dto/update.me-media-played-time.dto';

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
  @Put('/me')
  @ApiOperation({ summary: '[User] Update self' })
  async updateMe(@User() user: CurrentUser, @Body() selfUpdate: UpdateMeDto) {
    return this.usersService.updateMe(user, selfUpdate);
  }

  @Post('setMediaCurrentTime/:mediaId')
  @ApiOperation({ summary: '[User] Set media current time' })
  async setMediaCurrentTime(
    @User() user: CurrentUser,
    @Param('mediaId') mediaId: string,
    @Body() body: UpdateMeMediaPlayedTimeDto,
  ) {
    return this.usersService.setMediaPlayedTime(
      user,
      mediaId,
      body.currentTime,
      body.seasonIndex,
      body.episodeIndex,
    );
  }
}
