import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import {
  buildJWTStrategyOptions,
  currentUserFromPayload,
  JWTPayload,
} from "../auth.utils";
import CurrentUser from "../../users/current";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../users/user.schema";
import { Model } from "mongoose";
import { APIConfig } from "../../../config/config";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private configService: ConfigService<APIConfig>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    super(
      buildJWTStrategyOptions(
        configService.get("jwt"),
        configService.get("cookie")
      )
    );
  }

  async validate(payload: JWTPayload): Promise<CurrentUser> {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return currentUserFromPayload(this.userModel, payload);
  }
}
