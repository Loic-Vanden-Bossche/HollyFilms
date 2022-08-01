import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Media } from '../media.schema';
import {SchemaTypes} from "mongoose";

@Schema()
export class PlayedMedia {
  @Prop({ type: SchemaTypes.ObjectId, ref: Media.name })
  media: Media;

  @Prop()
  currentTime: number;

  @Prop({ default: undefined })
  seasonIndex?: number;

  @Prop({ default: undefined })
  episodeIndex?: number;

  @Prop()
  audioTrack: number;

  @Prop()
  subtitleTrack: number;
}

export const PlayedMediaSchema = SchemaFactory.createForClass(PlayedMedia);
