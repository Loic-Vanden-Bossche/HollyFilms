import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Season } from '../tvs/season.schema';
import { FileInfos } from './file-infos.schema';
import { Review } from './review.schema';
import { Actor } from './actor.schema';
import { Profile } from './profile.schema';

export class Director {
  name: string;
  profile_path: string;
}

export type MediaDocument = Media & Document;

@Schema()
export class Media {
  @Prop()
  TMDB_id: number;

  @Prop()
  title: string;

  @Prop()
  titleFr: string;

  @Prop()
  mediaType: string;

  @Prop()
  runtime: number;

  @Prop()
  budget: number;

  @Prop()
  genres: string[];

  @Prop()
  overview: string;

  @Prop()
  overviewFR: string;

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
  taglineFr: string;

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

  @Prop()
  tvs?: Season[];

  @Prop(FileInfos)
  fileInfos?: FileInfos;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
