import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';
import { DurationUnitType } from 'dayjs/plugin/duration';
import { HttpException, HttpStatus } from '@nestjs/common';
import CurrentUser from '../users/current';
import { Model } from 'mongoose';
import { UserDocument } from '../users/user.schema';
import { CookieConfig, JWTConfig } from '../../config/config';
import { getObjectId } from '../../shared/mongoose';
import { Media } from '../../medias/media.schema';

dayjs.extend(duration);

export const checkUniqueId = (id: string) => {
  if (id.length !== 16) {
    throw new HttpException('Invalid profile unique id', 400);
  }
  return id;
};

export const getExpirationDate = (dateString: string): Date | undefined => {
  const seconds = getExpirationDuration(dateString);
  if (!seconds) return undefined;
  return dayjs().add(seconds, 'second').toDate();
};

export const getExpirationDuration = (
  dateString: string,
): number | undefined => {
  if (!dateString) return undefined;
  const [value, unit] = dateString.split('-');
  return dayjs.duration(parseInt(value), unit as DurationUnitType).asSeconds();
};

export const buildJWTStrategyOptions = (
  jwtConfig: JWTConfig,
  cookieConfig: CookieConfig,
  expired = false,
): StrategyOptions => ({
  ignoreExpiration: expired,
  passReqToCallback: expired,
  secretOrKey: jwtConfig.secret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    (request: Request) => {
      const cookies = request?.cookies;
      if (!cookies) return null;

      const data = cookies[cookieConfig.name];
      if (!data) {
        return null;
      }
      return data.token;
    },
  ]),
});

export interface JWTPayload {
  _id: string;
  profileUniqueId: string;
  iat: number;
  exp: number;
}

export const currentUserFromPayload = (
  userModel: Model<UserDocument>,
  payload: JWTPayload,
): Promise<CurrentUser> =>
  userModel
    .findById(getObjectId(payload._id))
    .orFail(() => {
      throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
    })
    .populate({
      path: 'profiles.playedMedias',
      populate: {
        path: 'media',
        model: Media.name,
      },
    })
    .exec()
    .then((user) => new CurrentUser(user, payload.profileUniqueId));
