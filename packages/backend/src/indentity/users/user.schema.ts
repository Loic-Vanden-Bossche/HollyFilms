import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Token, TokenSchema } from '../tokens/token.schema';
import { Role } from '../../shared/role';
import { UserProfile, UserProfileSchema } from './user-profile.schema';
import { BaseIdSchema } from '../../shared/base.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends BaseIdSchema {
  @Prop({ required: true })
  email: string;

  @Prop({ type: [UserProfileSchema], default: [] })
  profiles: UserProfile[];

  @Prop()
  password: string;

  @Prop({
    default: [],
    enum: Role,
    type: Array,
  })
  roles: Role[];

  @Prop({ type: [TokenSchema], default: [] })
  tokens: Token[];

  @Prop({ default: false })
  isRegisteredWithGoogle: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
