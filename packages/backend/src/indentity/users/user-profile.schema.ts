import { Prop, Schema } from '@nestjs/mongoose';
import { PlayedMedia } from '../../medias/schemas/played-media.schema';
import { SchemaTypes } from 'mongoose';
import { Media } from '../../medias/media.schema';

@Schema()
export class UserProfile {
  @Prop()
  profileUniqueId: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  username: string;

  @Prop()
  color: string;

  @Prop({ default: undefined })
  playedMedias?: PlayedMedia[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Media.name }] })
  mediasInList?: Media[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Media.name }] })
  likedMedias?: Media[];
}
