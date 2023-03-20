import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "../../shared/base.schema";

export enum TokenContext {
  REGISTER_USER = "register_user",
  CHANGE_PASSWORD = "change_password",
  REFRESH_STRATEGY = "refresh_strategy",
}

@Schema({ timestamps: true })
export class Token extends BaseSchema {
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

export const TokenSchema = SchemaFactory.createForClass(Token);
