import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import {
  buildJWTStrategyOptions,
  currentUserFromPayload,
  JWTPayload,
} from '../auth.utils';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../users/user.schema';
import { Model } from 'mongoose';
import CurrentUser from '../../users/current';
import { APIConfig, CookieConfig, JWTConfig } from '../../../config/config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService<APIConfig>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super(
      buildJWTStrategyOptions(
        configService.get<JWTConfig>('jwt'),
        configService.get<CookieConfig>('cookie'),
        true,
      ),
    );
  }

  async validate(req: Request, payload: JWTPayload): Promise<CurrentUser> {
    if (!payload) {
      throw new BadRequestException('Invalid jwt token');
    }
    const data =
      req?.cookies[this.configService.get<CookieConfig>('cookie').name];
    if (!data?.refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    await this.authService.validateRefreshToken(payload._id, data.refreshToken);

    return currentUserFromPayload(this.userModel, payload);
  }
}
