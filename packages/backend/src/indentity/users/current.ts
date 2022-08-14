import { User } from './user.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../shared/role';
import { Types } from 'mongoose';
import { PlayedMedia } from '../../medias/schemas/played-media.schema';

export default class CurrentUser {
  constructor(user: Partial<User & { _id: Types.ObjectId }>) {
    this._id = user._id.toString();
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.username = user.username;
    this.roles = user.roles;
    this.isActivated = user.roles.length > 0;
    this.isAdmin = user.roles.includes(Role.Admin);
    this.playedMedias = user.playedMedias.filter((p) => p.media);
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

  @ApiProperty({
    description: 'Is the user activated',
    example: 'true',
  })
  isActivated: boolean;

  @ApiProperty({
    description: 'Array of medias that the user has played',
  })
  playedMedias?: PlayedMedia[];
}
