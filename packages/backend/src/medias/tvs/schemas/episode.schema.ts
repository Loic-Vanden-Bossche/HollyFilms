import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FileInfos, FileInfosSchema } from '../../schemas/file-infos.schema';
import { BaseSchema } from '../../../shared/base.schema';

@Schema({ timestamps: true, _id: false })
export class Episode extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  index: number;

  @Prop()
  overview: string;

  @Prop()
  still_path: string;

  @Prop()
  runtime?: number;

  @Prop()
  vote_average: number;

  @Prop()
  available: boolean;

  @Prop()
  queued?: boolean;

  @Prop()
  dateAdded?: Date;

  @Prop()
  releaseDate: Date;

  @Prop({ type: FileInfosSchema, default: undefined })
  fileInfos?: FileInfos;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);
