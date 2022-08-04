import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { Media } from '../medias/media.schema';

export type QueuedProcessDocument = QueuedProcess & Document;

@Schema()
export class QueuedProcess {
  @Prop({ auto: true, type: MongooseSchema.Types.ObjectId })
  _id?: string;

  @Prop()
  filePath: string;

  @Prop()
  targetPath: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Media.name })
  media: Media;

  @Prop({ required: false })
  seasonIndex?: number;

  @Prop({ required: false })
  episodeIndex?: number;

  @Prop({ default: () => new Date() })
  dateAdded: Date;
}

export const QueuedProcessSchema = SchemaFactory.createForClass(QueuedProcess);
