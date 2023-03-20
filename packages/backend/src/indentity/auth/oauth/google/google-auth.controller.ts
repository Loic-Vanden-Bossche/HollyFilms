import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post, Res } from "@nestjs/common";
import { GoogleAuthService } from "./google-auth.service";
import { Public } from "../../../../shared/decorators/public.decorator";
import { GoogleTokenDto } from "./dto/google-token.dto";
import { AuthService } from "../../auth.service";
import { Response } from "express";
import CurrentUser from "../../../users/current";

@ApiTags("Google-Auth")
@Controller("google-auth")
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post()
  async authenticate(
    @Body() tokenData: GoogleTokenDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = new CurrentUser(
      await this.googleAuthService.authenticate(tokenData.token)
    );
    this.authService.attachCookie(
      response,
      await this.authService.getTokens(user)
    );

    return user;
  }
}
