import { Module } from "@nestjs/common";
import { MailsService } from "./mails.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ConfigService } from "@nestjs/config";
import { APIConfig, MailsConfig } from "../config/config";
import { appendExecutionPath } from "../shared/utils";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService<APIConfig>) => {
        const env = configService.get("currentEnv");
        const mailsConfig = configService.get<MailsConfig>("mails");
        return {
          transport: `smtp://${mailsConfig.user}:${encodeURI(
            mailsConfig.password
          )}@${mailsConfig.host}`,
          defaults: {
            from: `"${mailsConfig.userTag}" <${mailsConfig.user}>`,
          },
          template: {
            dir: appendExecutionPath(env, "templates"),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
