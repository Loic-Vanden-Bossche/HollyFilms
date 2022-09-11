import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import CreateUserDto from './dto/create.user.dto';
import UpdateUserDto from './dto/update.user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CurrentUser from './current';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { AdminConfig } from '../../config/config';
import { defaultConfig } from '../../config/config.default';
import { Role } from '../../shared/role';
import { getObjectId } from '../../shared/mongoose';
import { MediaType, TrackData } from '../../medias/medias.utils';
import * as randomToken from 'rand-token';
import CreateProfileDto from './dto/create.profile.dto';
import { getRandomColor, getRandomizedColors } from './colors-profiles';
import { UserProfile } from './user-profile.schema';
import { MediasService } from '../../medias/medias.service';

import * as fsp from 'fs/promises';
import * as fs from 'fs';
import { TmdbService } from '../../tmdb/tmdb.service';
import { TMDBMicroSearchResult } from '../../tmdb/tmdb.models';
import { CurrentMediaRecord, CurrentPlayedMedia } from './profile';
import { getUsersToMigrate } from '../../bootstrap/migrations';

@Injectable()
export class UsersService {
  logger = new Logger('Users');

  constructor(
    private readonly authService: AuthService,
    private readonly mediasService: MediasService,
    private readonly configService: ConfigService,
    private readonly tmdbService: TmdbService,
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

  getProfiles(user: CurrentUser) {
    return this.userModel
      .findById(getObjectId(user._id))
      .orFail(() => {
        throw new HttpException(
          `User ${user._id} not found`,
          HttpStatus.NOT_FOUND,
        );
      })
      .then((u) => u.profiles);
  }

  getProfileInsights(user: CurrentUser, uniqueId: string) {
    return this.getProfile(user, uniqueId).then(async (profile) => ({
      totalPlayTime: (profile.playedMedias || []).reduce((acc, media) => {
        return acc + media.currentTime || 0;
      }, 0),
      watchedMedias: profile.playedMedias?.length || 0,
      favoriteGenre: profile.playedMedias?.length
        ? await this.mediasService.getMostRedondantGenreFromMedias(
            profile.playedMedias.map((pm) => pm.media._id.toString()),
          )
        : 'Aucun',
    }));
  }

  getProfile(user: CurrentUser, uniqueId: string): Promise<UserProfile> {
    const profileUniqueId =
      uniqueId === 'current' ? user.profileUniqueId : uniqueId;
    return this.userModel
      .findById(getObjectId(user._id))
      .orFail(() => {
        throw new HttpException(
          `User ${user._id} not found`,
          HttpStatus.NOT_FOUND,
        );
      })
      .then((u) => {
        const profile = u.profiles.find(
          (p) => p.profileUniqueId === profileUniqueId,
        );
        if (!profile)
          throw new HttpException(
            `Profile ${profileUniqueId} not found for user ${user._id}`,
            HttpStatus.NOT_FOUND,
          );
        return profile;
      });
  }

  getRandomProfileColor(userColors: string[]) {
    const randomizedColors = getRandomizedColors();
    for (const userColor of randomizedColors) {
      if (!userColors.includes(userColor)) {
        return userColor;
      }
    }

    return randomizedColors[0];
  }

  getMicroMediaFromTmdb(tmdbId: number, mediaType: MediaType) {
    switch (mediaType) {
      case 'movie':
        return this.tmdbService.getMovie(tmdbId);
      case 'tv':
        return this.tmdbService.getTv(tmdbId);
    }
  }

  createAddRequest(user: CurrentUser, mediaType: MediaType, tmdbId: number) {
    return this.getMicroMediaFromTmdb(tmdbId, mediaType)
      .then((media) => ({
        original_title: media.data.title,
        TMDB_id: media.data.TMDB_id,
        poster_path: media.data.poster_path,
        backdrop_path: media.data.backdrop_path,
        release_date: media.data.release_date,
        mediaType: media.mediaType,
      }))
      .catch(() => {
        throw new HttpException(
          `Media ${tmdbId} not found`,
          HttpStatus.NOT_FOUND,
        );
      })
      .then((media: TMDBMicroSearchResult) =>
        this.userModel
          .findOneAndUpdate(
            {
              _id: getObjectId(user._id),
              profiles: {
                $elemMatch: {
                  profileUniqueId: user.profileUniqueId,
                },
              },
            },
            {
              $push: {
                'profiles.$.addRequestedMedias': media,
              },
            },
          )
          .then(() => media),
      );
  }

  addMediaToList(user: CurrentUser, mediaId: string) {
    if (user.mediasInList?.map((m) => m.mediaId.toString()).includes(mediaId)) {
      throw new HttpException(
        `Media ${mediaId} already in list`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.mediasService
      .isExist(mediaId)
      .catch(() => {
        throw new HttpException(
          `Media ${mediaId} not found`,
          HttpStatus.NOT_FOUND,
        );
      })
      .then(() => {
        return this.userModel
          .findOneAndUpdate(
            {
              _id: getObjectId(user._id),
              profiles: {
                $elemMatch: {
                  profileUniqueId: user.profileUniqueId,
                },
              },
            },
            {
              $push: {
                'profiles.$.mediasInList': {
                  media: getObjectId(mediaId),
                },
              },
            },
            { new: true },
          )
          .then(
            (updatedUser) =>
              updatedUser.profiles
                .find((p) => p.profileUniqueId === user.profileUniqueId)
                ?.mediasInList.map(
                  (m) =>
                    ({
                      mediaId: m.media as unknown as string,
                      createdAt: m.createdAt,
                    } as CurrentMediaRecord),
                ) || [],
          );
      });
  }

  removeMediaFromList(user: CurrentUser, mediaId: string) {
    if (
      !user.mediasInList?.map((m) => m.mediaId.toString()).includes(mediaId)
    ) {
      throw new HttpException(
        `Media ${mediaId} not in list`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userModel
      .findOneAndUpdate(
        {
          _id: getObjectId(user._id),
          profiles: {
            $elemMatch: {
              profileUniqueId: user.profileUniqueId,
            },
          },
        },
        {
          $pull: {
            'profiles.$.mediasInList': {
              media: getObjectId(mediaId),
            },
          },
        },
        { new: true },
      )
      .then(
        (updatedUser) =>
          updatedUser.profiles
            .find((p) => p.profileUniqueId === user.profileUniqueId)
            ?.mediasInList.map(
              (m) =>
                ({
                  mediaId: m.media as unknown as string,
                  createdAt: m.createdAt,
                } as CurrentMediaRecord),
            ) || [],
      );
  }

  likeMedia(user: CurrentUser, mediaId: string) {
    if (user.likedMedias?.map((m) => m.mediaId.toString()).includes(mediaId)) {
      throw new HttpException(
        `Media ${mediaId} already liked`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.mediasService
      .isExist(mediaId)
      .catch(() => {
        throw new HttpException(
          `Media ${mediaId} not found`,
          HttpStatus.NOT_FOUND,
        );
      })
      .then(() => {
        return this.userModel
          .findOneAndUpdate(
            {
              _id: getObjectId(user._id),
              profiles: {
                $elemMatch: {
                  profileUniqueId: user.profileUniqueId,
                },
              },
            },
            {
              $push: {
                'profiles.$.likedMedias': {
                  media: getObjectId(mediaId),
                },
              },
            },
            { new: true },
          )
          .then(
            (updatedUser) =>
              updatedUser.profiles
                .find((p) => p.profileUniqueId === user.profileUniqueId)
                ?.likedMedias.map(
                  (m) =>
                    ({
                      mediaId: m.media as unknown as string,
                      createdAt: m.createdAt,
                    } as CurrentMediaRecord),
                ) || [],
          );
      });
  }

  unlikeMedia(user: CurrentUser, mediaId: string) {
    if (!user.likedMedias?.map((m) => m.mediaId.toString()).includes(mediaId)) {
      throw new HttpException(
        `Media ${mediaId} not liked`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userModel
      .findOneAndUpdate(
        {
          _id: getObjectId(user._id),
          profiles: {
            $elemMatch: {
              profileUniqueId: user.profileUniqueId,
            },
          },
        },
        {
          $pull: {
            'profiles.$.likedMedias': {
              media: getObjectId(mediaId),
            },
          },
        },
        { new: true },
      )
      .then(
        (updatedUser) =>
          updatedUser.profiles
            .find((p) => p.profileUniqueId === user.profileUniqueId)
            ?.likedMedias.map(
              (m) =>
                ({
                  mediaId: m.media as unknown as string,
                  createdAt: m.createdAt,
                } as CurrentMediaRecord),
            ) || [],
      );
  }

  async createProfile(user: CurrentUser, dto: CreateProfileDto) {
    const userProfiles = await this.userModel
      .findById(getObjectId(user._id))
      .then((u) => u.profiles);

    return this.userModel
      .findByIdAndUpdate(
        getObjectId(user._id),
        {
          $push: {
            profiles: {
              color: this.getRandomProfileColor(
                userProfiles.map((p) => p.color),
              ),
              profileUniqueId: randomToken.generate(16),
              username: dto.username.trim(),
              firstname: dto.firstname.trim(),
              lastname: dto.lastname.trim(),
            },
          },
        },
        {
          new: true,
        },
      )
      .then((u) => u.profiles[u.profiles.length - 1]);
  }

  updateProfile(user: CurrentUser, dto: CreateProfileDto, uniqueId: string) {
    return this.userModel
      .findByIdAndUpdate(
        getObjectId(user._id),
        {
          $set: {
            'profiles.$[elem].username': dto.username.trim(),
            'profiles.$[elem].firstname': dto.firstname.trim(),
            'profiles.$[elem].lastname': dto.lastname.trim(),
          },
        },
        {
          arrayFilters: [{ 'elem.profileUniqueId': uniqueId }],
          returnOriginal: false,
        },
      )
      .then((u) => u.profiles.find((p) => p.profileUniqueId === uniqueId));
  }

  getProfilePicturePath(userId: string, uniqueId: string, hash: string) {
    return `${this.configService.get<string>(
      'dataStorePath',
    )}/profile_pictures/profilePicture.${userId}.${uniqueId}.${hash}.jpg`;
  }

  checkDataStorePath() {
    const dataStorePath = `${this.configService.get<string>(
      'dataStorePath',
    )}/profile_pictures`;
    if (!fs.existsSync(dataStorePath)) {
      return fsp.mkdir(dataStorePath, { recursive: true });
    }
  }

  async getProfilePicture(user: CurrentUser, uniqueId: string, hash: string) {
    return fsp.readFile(this.getProfilePicturePath(user._id, uniqueId, hash));
  }

  deleteProfilePicture(user: CurrentUser) {
    if (user.picture) {
      const oldPath = this.getProfilePicturePath(
        user._id,
        user.profileUniqueId,
        user.picture.split('/').pop(),
      );
      if (fs.existsSync(oldPath)) {
        fsp.rm(oldPath);
      }
    }
  }

  async uploadProfilePicture(user: CurrentUser, file?: Express.Multer.File) {
    this.deleteProfilePicture(user);

    await this.checkDataStorePath();
    const hash = randomToken.generate(32);

    if (file) {
      await fsp.writeFile(
        this.getProfilePicturePath(user._id, user.profileUniqueId, hash),
        file.buffer,
      );
    }

    return this.userModel
      .findByIdAndUpdate(
        getObjectId(user._id),
        {
          $set: {
            'profiles.$[elem].picture': file
              ? `picture/${user.profileUniqueId}/${hash}`
              : null,
          },
        },
        {
          arrayFilters: [{ 'elem.profileUniqueId': user.profileUniqueId }],
          returnOriginal: false,
        },
      )
      .then((u) =>
        u.profiles.find((p) => p.profileUniqueId === user.profileUniqueId),
      );
  }

  migrateFromDatabase() {
    // playedMedias reset deactivated
    /*this.userModel.find({}).then((users) => {
      return Promise.all(
        users.map((user) => {
          return getOldPlayedMediasFromUserId(user._id.toString()).then(
            (playedMedias) => {
              if (playedMedias.length > 0) {
                Promise.all(
                  playedMedias.map((pm) =>
                    this.mediasService
                      .getMedia((pm.media as unknown as string).toString())
                      .catch(() => null)
                      .then((m) => ({ m, pm })),
                  ),
                ).then((data) => {
                  user.profiles[0].playedMedias = data
                    .filter((d) => d.m?.data._id)
                    .map((d) => d.pm);
                  user.save();
                });
              }
            },
          );
        }),
      );
    });*/

    this.userModel
      .countDocuments()
      .exec()
      .then((count) => {
        if (count <= 0) {
          getUsersToMigrate().then((users) => this.userModel.insertMany(users));
        }
      });
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
          profileUniqueId: randomToken.generate(16),
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

  deleteProfile(user: CurrentUser) {
    if (user.isDefault) {
      throw new HttpException(
        `You can't delete your default profile`,
        HttpStatus.FORBIDDEN,
      );
    }

    this.deleteProfilePicture(user);

    return this.userModel
      .findByIdAndUpdate(
        getObjectId(user._id),
        {
          $pull: {
            profiles: {
              profileUniqueId: user.profileUniqueId,
            },
          },
        },
        {
          returnOriginal: false,
        },
      )
      .exec();
  }

  getPlayerStatus(
    currentUser: CurrentUser,
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
            _id: getObjectId(currentUser._id),
            profiles: {
              $elemMatch: {
                profileUniqueId: currentUser.profileUniqueId,
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
            'profiles.profileUniqueId': currentUser.profileUniqueId,
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
      .then((user: any[]) =>
        !user?.length
          ? {}
          : user.filter((u) => u.playedMedias?.length)[0].playedMedias[0],
      );
  }

  trackUser(
    user: CurrentUser,
    trackData: TrackData,
  ): Promise<CurrentPlayedMedia[]> {
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
              profileUniqueId: user.profileUniqueId,
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
            { 'outer.profileUniqueId': user.profileUniqueId },
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
                  profileUniqueId: user.profileUniqueId,
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
        return u?.profiles.find(
          (p) => p.profileUniqueId === user.profileUniqueId,
        ).playedMedias;
      })
      .then((playedMedias) =>
        playedMedias.map((pm) => new CurrentPlayedMedia(pm)),
      );
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
          color: getRandomColor(),
          isDefault: true,
          profileUniqueId: randomToken.generate(16),
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
