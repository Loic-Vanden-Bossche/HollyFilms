import { Injectable, Logger } from "@nestjs/common";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { APIConfig } from "../config/config";
import CurrentUser from "../indentity/users/current";
import { Token } from "../indentity/tokens/token.schema";
import { Environment } from "../config/config.default";
import { appendExecutionPath } from "../shared/utils";

@Injectable()
export class MailsService {
  private readonly logger = new Logger("Mails");

  constructor(
    private readonly mailer: MailerService,
    private readonly configService: ConfigService<APIConfig>
  ) {}

  sendEmail(config: ISendMailOptions) {
    this.logger.verbose(`Sending ${config.subject} email to ${config.to}`);
    return this.mailer.sendMail({
      ...config,
      attachments:
        config.attachments?.map((attachment) => ({
          ...attachment,
          path: appendExecutionPath(
            this.configService.get<Environment>("currentEnv"),
            `assets/${attachment.path}`
          ),
        })) || [],
    });
  }

  async sendResetPasswordEmail(to: CurrentUser, token: Token) {
    return this.sendEmail({
      to: to.email,
      subject: "Changement de mot de passe",
      template: "change-password",
      context: {
        link: `${this.configService.get(
          "frontendUrl"
        )}/auth/change-password?token=${token.value}`,
        email: to.email,
      },
      attachments: [
        {
          filename: "logo.png",
          path: "logo.png",
          cid: "logo@png.xx",
        },
      ],
    });
  }

  async sendInfoEmail(to: CurrentUser, title: string, message: string) {
    return this.sendEmail({
      to: to.email,
      subject: title,
      template: "info",
      context: {
        title,
        message,
      },
      attachments: [
        {
          filename: "logo.png",
          path: "logo.png",
          cid: "logo@png.xx",
        },
      ],
    });
  }
}
