import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_DISABLED_KEY } from '../decorators/disabled.decorator';

@Injectable()
export class DisabledGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const value = this.reflector.getAllAndOverride<boolean | string>(
      IS_DISABLED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isDisabled = !!value;

    if (isDisabled) {
      throw new HttpException(
        value === true ? 'This route is disabled' : value,
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
