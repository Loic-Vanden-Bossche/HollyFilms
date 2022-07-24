import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import CurrentUser from 'src/indentity/users/current';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
