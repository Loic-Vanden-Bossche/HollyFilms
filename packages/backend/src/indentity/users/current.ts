import { User } from './user.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../shared/role';
import { Types } from 'mongoose';

export default class CurrentUser {
  constructor(user: Partial<User & { _id: Types.ObjectId }>) {
    this._id = user._id.toString();
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.username = user.username;
    this.roles = user.roles;
    this.isAdmin = this.roles.includes(Role.Admin);
  }

  @ApiProperty({
    description: "The user's id",
    example: '5e9f8f8f8f8f8f8f8f8f8f8f8',
  })
  _id: string = null;

  @ApiProperty({
    description: "The user's email",
    example: 'exemplle.test@gmail.com',
  })
  email: string = null;

  @ApiProperty({
    description: "The user's first name",
    example: 'John',
  })
  firstname: string = null;

  @ApiProperty({
    description: "The user's last name",
    example: 'Doe',
  })
  lastname: string = null;

  @ApiProperty({
    description: "The user's nickname",
    example: 'Johnny',
  })
  username: string = null;

  @ApiProperty({
    description: "The user's roles",
    example: [Role.User, Role.Admin],
  })
  roles: Role[] = null;

  @ApiProperty({
    description: 'Is the user an Admin',
    example: 'true',
  })
  isAdmin?: boolean;
}
