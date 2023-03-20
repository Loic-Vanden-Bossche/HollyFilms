import { HttpException, Injectable } from "@nestjs/common";
import { UsersService } from "../../../users/users.service";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../../auth.service";
import { GoogleOAuthConfig } from "../../../../config/config";
import { OAuth2Client, TokenPayload } from "google-auth-library";

@Injectable()
export class GoogleAuthService {
  oauthClient: OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    const OAuthConfig =
      this.configService.get<GoogleOAuthConfig>("googleOAuth");

    this.oauthClient = new OAuth2Client(
      OAuthConfig.clientId,
      OAuthConfig.clientSecret
    );
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient
      .verifyIdToken({ idToken: token })
      .catch(() => {
        throw new HttpException("Invalid token", 403);
      })
      .then((ticket) => ticket.getPayload());

    const email = tokenInfo.email;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return this.registerUser(tokenInfo, email);
    }

    return user;
  }

  async registerUser(tokenInfo: TokenPayload, email: string) {
    const username = tokenInfo.name;
    const picture = tokenInfo.picture;
    const firstname = tokenInfo.given_name;
    const lastname = tokenInfo.family_name;

    return this.authService.register({
      email,
      firstname,
      lastname,
      username,
      isRegisteredWithGoogle: true,
      defaultPicture: picture,
    });
  }
}
