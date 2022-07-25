import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as chalk from 'chalk';
import CurrentUser from '../indentity/users/current';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Http');

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl, user } = request;
      const { statusCode, statusMessage } = response;

      const userEmail = user ? (user as CurrentUser).email : 'anonymous';
      const userIdAdmin = user ? (user as CurrentUser).isAdmin : false;

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage} from ${
        userIdAdmin ? chalk.red.bold(userEmail) : chalk.blue.bold(userEmail)
      }`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.verbose(message);
    });

    next();
  }
}
