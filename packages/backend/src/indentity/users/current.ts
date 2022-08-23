import { User } from './user.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../shared/role';
import { UserProfile } from './user-profile.schema';
import { Profile } from './profile';

export default class CurrentUser extends Profile {
  getProfileFromUniqueId(
    user: Partial<User>,
    profileUniqueId?: string,
  ): UserProfile {
    if (!profileUniqueId) {
      return user.profiles[0];
    }

    return (
      user.profiles.find((p) => p.profileUniqueId === profileUniqueId) ||
      user.profiles[0]
    );
  }

  constructor(user: Partial<User>, profileUniqueId?: string) {
    super();
    this._id = user._id.toString();
    this.email = user.email;
    this.roles = user.roles;
    this.isActivated = user.roles.length > 0;
    this.isAdmin = user.roles.includes(Role.Admin);

    // apply profile data
    const currentProfile = this.getProfileFromUniqueId(user, profileUniqueId);

    this.playedMedias =
      currentProfile.playedMedias?.filter((p) => p.media) || [];
    this.isDefault = currentProfile.isDefault;
    this.picture = currentProfile.picture;
    this.addRequestedMedias = currentProfile.addRequestedMedias || [];
    this.mediasInList =
      currentProfile.mediasInList?.map((m) => ({
        mediaId: m.media as unknown as string,
        createdAt: m.createdAt,
      })) || [];
    this.likedMedias =
      currentProfile.likedMedias?.map((m) => ({
        mediaId: m.media as unknown as string,
        createdAt: m.createdAt,
      })) || [];
    this.profileUniqueId = currentProfile.profileUniqueId;
    this.firstname = currentProfile.firstname;
    this.lastname = currentProfile.lastname;
    this.username = currentProfile.username;
    this.color = currentProfile.color;
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
}
