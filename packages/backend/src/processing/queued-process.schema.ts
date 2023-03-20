import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Media } from "../medias/media.schema";
import { BaseIdSchema } from "../shared/base.schema";

export type QueuedProcessDocument = QueuedProcess & Document;

@Schema({ timestamps: true })
export class QueuedProcess extends BaseIdSchema {
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
}

export const QueuedProcessSchema = SchemaFactory.createForClass(QueuedProcess);
