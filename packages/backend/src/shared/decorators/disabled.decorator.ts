import { SetMetadata } from '@nestjs/common';

export const IS_DISABLED_KEY = 'isDisabled';
export const Disabled = (message?: string) =>
  SetMetadata(IS_DISABLED_KEY, message || true);
