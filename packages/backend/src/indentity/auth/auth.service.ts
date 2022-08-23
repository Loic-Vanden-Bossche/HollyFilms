import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { getExpirationDate } from './auth.utils';
import LoginAuthDto from './dto/login.auth.dto';
import RegisterAuthDto from './dto/register.auth.dto';
import { TokensService } from '../tokens/tokens.service';
import ChangePasswordAuthDto from './dto/change-password.auth.dto';
import { User, UserDocument } from '../users/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenContext } from '../tokens/token.schema';
import CurrentUser from '../users/current';
import { APIConfig, CookieConfig, RTokenConfig } from '../../config/config';
import { Environment } from '../../config/config.default';
import { getSameSiteStrategy } from '../../config/config.utils';
import ResetPasswordDto from './dto/reset-password.auth.dto';
import { getObjectId } from '../../shared/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as randomToken from 'rand-token';
import { getRandomColor } from '../users/colors-profiles';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<APIConfig>,
    private readonly tokensService: TokensService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(userInfos: RegisterAuthDto): Promise<User> {
    this.logger.log(`Registering user ${userInfos.email}`);
    const user = await this.userModel
      .findOne({ email: userInfos.email })
      .exec();
    if (user) {
      this.logger.warn(`User ${userInfos.email} already exists`);
      throw new HttpException('Email Already Exists', HttpStatus.FORBIDDEN);
    }

    return this.userModel.create({
      email: userInfos.email,
      profiles: [
        {
          color: getRandomColor(),
          isDefault: true,
          profileUniqueId: randomToken.generate(16),
          firstname: userInfos.firstname,
          lastname: userInfos.lastname,
          username:
            userInfos.username ||
            `${userInfos.firstname} ${userInfos.lastname}`,
        },
      ],
      password: await this.hashPassword(userInfos.password),
    });
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async getTokens(user: CurrentUser) {
    return {
      token: this.jwtService.sign({
        profileUniqueId: user.profileUniqueId,
        _id: user._id,
      }),
      refreshToken: await this.generateRefreshToken(user._id).then(
        (token) => token.value,
      ),
    };
  }

  checkUserProfile(user: CurrentUser, uniqueId: string) {
    return this.userModel
      .findById(getObjectId(user._id))
      .orFail(() => {
        throw new HttpException(
          `User ${user._id} not found`,
          HttpStatus.NOT_FOUND,
        );
      })
      .then((u) => {
        const profile = u.profiles.find((p) => p.profileUniqueId === uniqueId);
        if (!profile)
          throw new HttpException(
            `Profile ${uniqueId} not found for user ${user._id}`,
            HttpStatus.NOT_FOUND,
          );
        return u;
      });
  }

  generateRefreshToken(userId: string): Promise<Token> {
    const config = this.configService.get<RTokenConfig>('rToken');
    return this.tokensService.generateToken({
      userId,
      context: TokenContext.REFRESH_STRATEGY,
      length: config.length,
      expiresAt: getExpirationDate(config.expiresIn),
    });
  }

  generateResetPasswordToken(userId: string): Promise<Token> {
    return this.tokensService.generateToken({
      userId,
      context: TokenContext.CHANGE_PASSWORD,
      length: 64,
      expiresAt: getExpirationDate('1-hour'),
    });
  }

  attachCookie(res: Response, token) {
    const env = this.configService.get<Environment>('currentEnv');
    const config = this.configService.get<CookieConfig>('cookie');

    res.cookie(config.name, token, {
      expires: getExpirationDate(config.expiresIn),
      secure: config.secure,
      sameSite: getSameSiteStrategy(env),
      httpOnly: true,
    });
  }

  clearCookie(res: Response) {
    const config = this.configService.get<CookieConfig>('cookie');
    res.clearCookie(config.name);
  }

  async validateUserCredentials(
    credentials: LoginAuthDto,
  ): Promise<CurrentUser> {
    this.logger.log(`Validating user ${credentials.email} credentials`);
    const user = await this.userModel
      .findOne({ email: credentials.email })
      .orFail(() => {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      })
      .exec();

    const valid = await this.comparePasswords(
      credentials.password,
      user.password,
    );
    if (!valid) {
      this.logger.warn(`Invalid credentials for user ${credentials.email}`);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return new CurrentUser(user);
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<Token> {
    return this.tokensService.validateToken(
      getObjectId(userId),
      refreshToken,
      TokenContext.REFRESH_STRATEGY,
    );
  }

  async resetPassword(resetPassword: ResetPasswordDto) {
    this.logger.log(`Resetting password for user ${resetPassword.email}`);
    return this.userModel
      .findOne({ email: resetPassword.email })
      .orFail(() => {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      })
      .exec()
      .then(() => ({ message: 'Password reset email sent' }));
  }

  async processPassword(
    password: string | undefined,
    passwordConfirm: string | undefined,
    old?: string,
  ): Promise<string | undefined> {
    if (passwordConfirm && !password) {
      throw new HttpException(
        'You must provide a password for password confirmation',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password) {
      if (old && (await this.comparePasswords(password, old))) {
        throw new HttpException(
          `New password and old password are the same`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (passwordConfirm && password !== passwordConfirm) {
        throw new HttpException(
          `New password and new password confirmation not match`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.hashPassword(password);
    }
    return undefined;
  }

  async changePassword(changePassword: ChangePasswordAuthDto) {
    const user = await this.userModel
      .findOne({ email: changePassword.email })
      .orFail(() => {
        throw new HttpException(
          `User ${changePassword.email} not found`,
          HttpStatus.NOT_FOUND,
        );
      })
      .exec();

    const token = await this.tokensService.validateToken(
      user._id,
      changePassword.token,
      TokenContext.CHANGE_PASSWORD,
    );

    return this.userModel
      .findByIdAndUpdate(getObjectId(user._id), {
        password: await this.processPassword(
          changePassword.newPassword,
          changePassword.newPasswordConfirm,
          user.password,
        ),
      })
      .exec()
      .then(() => this.tokensService.consumeToken(user._id, token))
      .then(() => ({ message: 'Password changed' }));
  }
}
