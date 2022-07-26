import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Media } from '../media.schema';

@Schema()
export class PlayedMedia {
  @Prop()
  media: Media;

  @Prop()
  currentTime: number;

  @Prop()
  seasonIndex?: number;

  @Prop()
  episodeIndex?: number;

  @Prop()
  audioTrack: number;

  @Prop()
  subtitleTrack: number;
}

export const PlayedMediaSchema = SchemaFactory.createForClass(PlayedMedia);
