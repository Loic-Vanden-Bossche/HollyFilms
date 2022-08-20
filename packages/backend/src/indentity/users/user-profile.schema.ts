import { Prop, Schema } from '@nestjs/mongoose';
import { PlayedMedia } from '../../medias/schemas/played-media.schema';

@Schema()
export class UserProfile {
  @Prop()
  uniqueId: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  username: string;

  @Prop()
  playedMedias?: PlayedMedia[];
}
