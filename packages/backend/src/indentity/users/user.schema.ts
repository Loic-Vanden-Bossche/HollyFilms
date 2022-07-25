import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Token } from '../tokens/token.schema';
import { Role } from '../../shared/role';
import { PlayedMedia } from '../../medias/schemas/played-media.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({
    default: [Role.User],
    enum: Role,
    type: Array,
  })
  roles: Role[];

  @Prop()
  tokens: Token[];

  @Prop()
  playedMedias: PlayedMedia[];
}

export const UserSchema = SchemaFactory.createForClass(User);
