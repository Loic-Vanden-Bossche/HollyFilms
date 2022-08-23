import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Season, SeasonSchema } from './tvs/schemas/season.schema';
import { FileInfos, FileInfosSchema } from './schemas/file-infos.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Actor, ActorSchema } from './schemas/actor.schema';
import { DataProfile, DataProfileSchema } from './schemas/profile.schema';
import { BaseIdSchema } from '../shared/base.schema';

export class Director {
  name: string;
  profile_path: string;
}

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media extends BaseIdSchema {
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

  @Prop({ type: DataProfileSchema })
  director: DataProfile;

  @Prop({ type: ActorSchema })
  actors: Actor[];

  @Prop()
  rating: number;

  @Prop({ type: [ReviewSchema], default: [] })
  reviews: Review[];

  @Prop()
  trailer_key: string;

  @Prop({ default: false })
  available?: boolean;

  @Prop({ type: [SeasonSchema], default: undefined })
  tvs?: Season[];

  @Prop({ type: FileInfosSchema, default: undefined })
  fileInfos?: FileInfos;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
