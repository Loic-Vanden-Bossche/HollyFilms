import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { FileInfos } from '../../schemas/file-infos.schema';

@Schema()
export class Episode {
  name: string;
  index: number;
  overview: string;
  still_path: string;
  runtime?: number;
  vote_average: number;
  available: boolean;
  queued?: boolean;
  dateAdded?: Date;
  releaseDate: Date;
  fileInfos?: FileInfos;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);
