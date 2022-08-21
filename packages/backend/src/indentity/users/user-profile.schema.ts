import { Prop, Schema } from '@nestjs/mongoose';
import { PlayedMedia } from '../../medias/schemas/played-media.schema';
import { SchemaTypes } from 'mongoose';
import { Media } from '../../medias/media.schema';
import { TMDBMicroSearchResult } from '../../tmdb/tmdb.models';

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

  @Prop({ default: null })
  picture: string | null;

  @Prop()
  color: string;

  @Prop({ default: undefined })
  addRequestedMedias?: TMDBMicroSearchResult[];

  @Prop({ default: undefined })
  playedMedias?: PlayedMedia[];

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: Media.name }],
    default: undefined,
  })
  mediasInList?: Media[];

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: Media.name }],
    default: undefined,
  })
  likedMedias?: Media[];
}
