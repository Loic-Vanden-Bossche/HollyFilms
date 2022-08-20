import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import CreateUserDto from './dto/create.user.dto';
import UpdateUserDto from './dto/update.user.dto';
import UpdateMeDto from './dto/update.me.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CurrentUser from './current';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { AdminConfig } from '../../config/config';
import { defaultConfig } from '../../config/config.default';
import { Role } from '../../shared/role';
import { getObjectId } from '../../shared/mongoose';
import { TrackData } from '../../medias/medias.utils';
import * as randomToken from 'rand-token';

@Injectable()
export class UsersService {
  logger = new Logger('Users');

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  findAll() {
    return this.userModel
      .find()
      .exec()
      .then((users) => users.map((u) => new CurrentUser(u)));
  }

  findById(id: string) {
    return this.userModel
      .findById(getObjectId(id))
      .orFail(() => {
        throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
      })
      .exec()
      .then((user) => new CurrentUser(user));
  }

  findByIdLimited(id: string) {
    return this.userModel
      .findById(getObjectId(id))
      .select('-token -password -roles')
      .exec();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async isAlreadyExist(email: string) {
    const existsUser = await this.userModel.findOne({ email }).exec();
    if (existsUser)
      throw new HttpException(
        `User ${existsUser.email} already exists`,
        HttpStatus.FORBIDDEN,
      );
  }

  async create(user: CreateUserDto) {
    await this.isAlreadyExist(user.email);

    return this.userModel.create({
      email: user.email,
      roles: [user.roles],
      profiles: [
        {
          uniqueId: randomToken.generate(16),
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
        },
      ],
      password: await this.authService.hashPassword(user.password),
    });
  }

  isExist(id: string) {
    return this.userModel
      .findById(id)
      .orFail(() => {
        throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
      })
      .exec();
  }

  async updateMe(user: CurrentUser, selfUpdate: UpdateMeDto) {
    return this.isExist(user._id)
      .then((user) =>
        this.authService.processPassword(
          selfUpdate.newPassword,
          selfUpdate.newPasswordConfirm,
          user.password,
        ),
      )
      .then((newPassword) =>
        this.userModel
          .findByIdAndUpdate(
            getObjectId(user._id),
            {
              ...selfUpdate,
              password: newPassword,
            },
            {
              returnOriginal: false,
            },
          )
          .exec(),
      )
      .then((u) => new CurrentUser(u));
  }

  async update(id: string, userUpdate: UpdateUserDto) {
    await this.isExist(id);
    return this.userModel
      .findByIdAndUpdate(
        getObjectId(id),
        {
          ...userUpdate,
          password: await this.authService.hashPassword(userUpdate.password),
        },
        {
          returnOriginal: false,
        },
      )
      .exec();
  }

  async delete(id: string): Promise<any> {
    await this.isExist(id);
    return this.userModel.deleteOne({ _id: getObjectId(id) });
  }

  getPlayerStatus(
    user: CurrentUser,
    mediaId: string,
    seasonIndex?: number,
    episodeIndex?: number,
  ) {
    const indexes = { seasonIndex, episodeIndex };
    const tvReady = indexes.seasonIndex && indexes.episodeIndex;

    const indexesParams = tvReady
      ? indexes
      : {
          seasonIndex: { $exists: false },
          episodeIndex: { $exists: false },
        };

    return this.userModel
      .aggregate([
        {
          $match: {
            _id: getObjectId(user._id),
            profiles: {
              $elemMatch: {
                uniqueId: user.profileUniqueId,
                playedMedias: {
                  $elemMatch: {
                    media: getObjectId(mediaId),
                    ...indexesParams,
                  },
                },
              },
            },
          },
        },
        { $unwind: '$profiles' },
        {
          $project: {
            'profiles.uniqueId': user.profileUniqueId,
            playedMedias: {
              $filter: {
                input: '$profiles.playedMedias',
                as: 'playedMedia',
                cond: {
                  $eq: ['$$playedMedia.media', getObjectId(mediaId)],
                },
              },
            },
          },
        },
      ])
      .exec()
      .then((user: any[]) => (!user.length ? {} : user[0].playedMedias[0]));
  }

  trackUser(user: CurrentUser, trackData: TrackData): any {
    const indexes = { seasonIndex: trackData.si, episodeIndex: trackData.ei };
    const tvReady = indexes.seasonIndex && indexes.episodeIndex;

    const indexesParams = tvReady
      ? indexes
      : {
          seasonIndex: { $exists: false },
          episodeIndex: { $exists: false },
        };

    return this.userModel
      .findOneAndUpdate(
        {
          _id: getObjectId(user._id),
          profiles: {
            $elemMatch: {
              uniqueId: user.profileUniqueId,
              playedMedias: {
                $elemMatch: {
                  media: getObjectId(trackData.mediaId),
                  ...indexesParams,
                },
              },
            },
          },
        },
        {
          $set: {
            ...(trackData.time !== undefined
              ? {
                  'profiles.$[outer].playedMedias.$[inner].currentTime':
                    trackData.time,
                }
              : {}),
            ...(trackData.ai !== undefined
              ? {
                  'profiles.$[outer].playedMedias.$[inner].audioTrack':
                    trackData.ai,
                }
              : {}),
            ...(trackData.ti !== undefined
              ? {
                  'profiles.$[outer].playedMedias.$[inner].subtitleTrack':
                    trackData.ti,
                }
              : {}),
          },
        },
        {
          arrayFilters: [
            { 'outer.uniqueId': user.profileUniqueId },
            { 'inner.media': getObjectId(trackData.mediaId) },
          ],
        },
      )
      .then((foundUser) => {
        if (!foundUser) {
          this.logger.verbose(
            `User ${user._id} added playedMedias entry for media ${trackData.mediaId}`,
          );
          return this.userModel.findOneAndUpdate(
            {
              _id: getObjectId(user._id),
              profiles: {
                $elemMatch: {
                  uniqueId: user.profileUniqueId,
                },
              },
            },
            {
              $push: {
                'profiles.$.playedMedias': {
                  media: getObjectId(trackData.mediaId),
                  ...(trackData.time !== undefined
                    ? { currentTime: trackData.time }
                    : {}),
                  ...(trackData.ai !== undefined
                    ? { audioTrack: trackData.ai }
                    : {}),
                  ...(trackData.ti !== undefined
                    ? { subtitleTrack: trackData.ti }
                    : {}),
                  ...(tvReady ? indexes : {}),
                },
              },
            },
          );
        } else {
          return foundUser;
        }
      })
      .then((u) => {
        this.logger.verbose(`User ${u._id} updated playedMedias`);
        return u?.profiles.find((p) => p.uniqueId === user.profileUniqueId)
          .playedMedias;
      });
  }

  deletePlayedMediasOccurences(mediaId: string): Promise<any> {
    return this.userModel
      .updateMany(
        {
          playedMedias: { $elemMatch: { _id: mediaId } },
        },
        { $pull: { playedMedias: { media: { _id: mediaId } } } },
      )
      .exec();
  }

  async createAdminAccount() {
    const adminConfig = this.configService.get<AdminConfig>('admin');

    this.logger.verbose('Checking admin account');

    if (adminConfig.password === defaultConfig.HF_ADMIN_PASSWORD) {
      this.logger.warn(
        `Admin password is default password, please change it if in production`,
      );
    }

    const user = await this.userModel
      .findOne({ email: adminConfig.email })
      .exec();

    if (user) {
      this.logger.verbose(`Admin ${user.email} already exists`);

      const validPassword = await this.authService.comparePasswords(
        adminConfig.password,
        user.password,
      );

      if (validPassword) {
        this.logger.verbose(`Password for admin ${user.email} is valid`);
        return;
      }

      this.logger.log(`Password for admin ${user.email} is invalid, updating`);

      user.password = await this.authService.hashPassword(adminConfig.password);
      await user.save();

      return;
    }

    this.logger.log(
      `Admin ${adminConfig.email} not found in database, creating`,
    );

    await this.userModel.create({
      email: adminConfig.email,
      profiles: [
        {
          uniqueId: randomToken.generate(16),
          firstname: 'Admin',
          lastname: 'Admin',
          username: 'Admin',
        },
      ],
      password: await this.authService.hashPassword(adminConfig.password),
      roles: [Role.Admin, Role.User],
    });
    this.logger.log(`Admin ${adminConfig.email} created`);
  }

  activateUser(id: string) {
    this.logger.log(`Activating user ${id}`);
    return this.userModel
      .findByIdAndUpdate(id, { roles: [Role.User] }, { new: true })
      .exec();
  }

  refuseUser(id: string) {
    this.logger.log(`Refusing user ${id}`);
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
