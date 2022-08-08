import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Season } from './tvs/schemas/season.schema';
import { FileInfos } from './schemas/file-infos.schema';
import { Review } from './schemas/review.schema';
import { Actor } from './schemas/actor.schema';
import { Profile } from './schemas/profile.schema';
import { Schema as MongooseSchema } from 'mongoose';

export class Director {
  name: string;
  profile_path: string;
}

export type MediaDocument = Media & Document;

@Schema()
export class Media {
  @Prop({ auto: true, type: MongooseSchema.Types.ObjectId })
  _id?: string;

  @Prop()
  TMDB_id: number;

  @Prop()
  title: string;

  @Prop()
  runtime: number;

  @Prop()
  budget: number;

  @Prop()
  genres: string[];

  @Prop()
  overview: string;

  @Prop()
  popularity: number;

  @Prop()
  release_date: string;

  @Prop()
  revenue: number;

  @Prop()
  poster_path: string;

  @Prop()
  backdrop_path: string;

  @Prop()
  tagline: string;

  @Prop()
  production_companies: Array<{ name: string; logo_path: string }>;

  @Prop(Profile)
  director: Profile;

  @Prop()
  actors: Actor[];

  @Prop()
  rating: number;

  @Prop()
  reviews: Review[];

  @Prop()
  trailer_key: string;

  @Prop({ default: false })
  available?: boolean;

  @Prop({ default: undefined })
  tvs?: Season[];

  @Prop(FileInfos)
  fileInfos?: FileInfos;

  @Prop({ default: () => new Date() })
  createdAt?: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
