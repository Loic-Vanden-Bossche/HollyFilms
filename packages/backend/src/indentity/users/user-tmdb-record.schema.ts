import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../shared/base.schema';

@Schema({ timestamps: true, _id: false })
export class UserTMDBRecord extends BaseSchema {
  @Prop()
  original_title: string;

  @Prop()
  TMDB_id: number;

  @Prop()
  poster_path: string;

  @Prop()
  backdrop_path: string;

  @Prop()
  release_date: string;

  @Prop()
  mediaType: 'tv' | 'movie';
}

export const UserTMDBRecordSchema =
  SchemaFactory.createForClass(UserTMDBRecord);
