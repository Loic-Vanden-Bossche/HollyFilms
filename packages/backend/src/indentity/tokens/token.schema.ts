import { Prop, Schema } from '@nestjs/mongoose';

export enum TokenContext {
  REGISTER_USER = 'register_user',
  CHANGE_PASSWORD = 'change_password',
  REFRESH_STRATEGY = 'refresh_strategy',
}

@Schema()
export class Token {
  @Prop()
  value: string;

  @Prop()
  length: number;

  @Prop({ enum: TokenContext, type: String })
  context: TokenContext;

  @Prop({ type: Boolean, default: false })
  consumed: boolean;

  @Prop()
  expiresAt: Date;
}
