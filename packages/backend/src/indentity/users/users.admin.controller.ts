import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/role';
import CreateUserDto from './dto/create.user.dto';
import UpdateUserDto from './dto/update.user.dto';
import { checkObjectId } from '../../shared/mongoose';

@ApiTags('Users Admin')
@Controller('users/admin')
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get()
  @ApiOperation({ summary: '[Admin] Get all users' })
  async getUsers() {
    return this.usersService.findAll();
  }

  @Roles(Role.Admin)
  @Get('/:id')
  @ApiOperation({ summary: '[Admin] Get specific user' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(checkObjectId(id));
  }

  @Roles(Role.Admin)
  @Post()
  @ApiOperation({ summary: '[Admin] Create new user' })
  async createUser(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Roles(Role.Admin)
  @Put('/:id')
  @ApiOperation({ summary: '[Admin] Update specific user' })
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.update(checkObjectId(id), user);
  }

  @Roles(Role.Admin)
  @Delete('/:id')
  @ApiOperation({ summary: '[Admin] Delete specific user' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(checkObjectId(id));
  }
}
