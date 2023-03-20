import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Media } from "../media.schema";
import { SchemaTypes } from "mongoose";
import { BaseSchema } from "../../shared/base.schema";

@Schema({ timestamps: true, _id: false })
export class PlayedMedia extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: Media.name })
  media: Media;

  @Prop()
  currentTime: number;

  @Prop({ default: undefined })
  seasonIndex?: number;

  @Prop({ default: undefined })
  episodeIndex?: number;

  @Prop({ default: undefined })
  audioTrack?: number;

  @Prop({ default: undefined })
  subtitleTrack?: number;
}

export const PlayedMediaSchema = SchemaFactory.createForClass(PlayedMedia);
