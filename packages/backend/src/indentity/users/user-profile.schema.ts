import { Prop, Schema } from '@nestjs/mongoose';
import { PlayedMedia } from '../../medias/schemas/played-media.schema';

@Schema()
export class UserProfile {
  @Prop()
  profileUniqueId: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  username: string;

  @Prop()
  color: string;

  @Prop()
  playedMedias?: PlayedMedia[];
}
