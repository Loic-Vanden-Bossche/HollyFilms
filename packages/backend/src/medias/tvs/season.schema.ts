import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Episode } from './episode.schema';

@Schema()
export class Season {
  index: number;
  name: string;
  episode_count: number;
  overview: string;
  poster_path: string;
  avaliable: true;
  dateAdded?: Date;
  episodes?: Episode[];
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
