import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Token } from '../tokens/token.schema';
import { Role } from '../../shared/role';
import { UserProfile } from './user-profile.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ auto: true, type: MongooseSchema.Types.ObjectId })
  _id?: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  profiles: UserProfile[];

  @Prop()
  password: string;

  @Prop({
    default: [],
    enum: Role,
    type: Array,
  })
  roles: Role[];

  @Prop()
  tokens: Token[];
}

export const UserSchema = SchemaFactory.createForClass(User);
