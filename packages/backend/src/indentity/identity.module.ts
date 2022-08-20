import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { User, UserSchema } from './users/user.schema';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getExpirationDuration } from './auth/auth.utils';
import { APIConfig, JWTConfig } from '../config/config';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { RefreshStrategy } from './auth/strategies/refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthController } from './auth/auth.controller';
import { TokensService } from './tokens/tokens.service';
import { UsersAdminController } from './users/users.admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { MediasModule } from '../medias/medias.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<APIConfig>) => {
        const config = configService.get<JWTConfig>('jwt');
        return {
          secret: config.secret,
          signOptions: {
            expiresIn: getExpirationDuration(config.expiresIn),
          },
        };
      },
      inject: [ConfigService],
    }),
    forwardRef(() => MediasModule),
  ],
  providers: [
    UsersService,
    TokensService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [UsersController, UsersAdminController, AuthController],
  exports: [UsersService, MongooseModule],
})
export class IdentityModule {}
