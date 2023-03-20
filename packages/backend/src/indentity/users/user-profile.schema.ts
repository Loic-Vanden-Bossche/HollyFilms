import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  PlayedMedia,
  PlayedMediaSchema,
} from "../../medias/schemas/played-media.schema";
import { BaseSchema } from "../../shared/base.schema";
import {
  UserTMDBRecord,
  UserTMDBRecordSchema,
} from "./user-tmdb-record.schema";
import {
  UserMediaRecord,
  UserMediaRecordSchema,
} from "./user-media-record.schema";

@Schema({ timestamps: true, _id: false })
export class UserProfile extends BaseSchema {
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

  @Prop({ type: [UserTMDBRecordSchema], default: undefined })
  addRequestedMedias?: UserTMDBRecord[];

  @Prop({ type: [PlayedMediaSchema], default: undefined })
  playedMedias?: PlayedMedia[];

  @Prop({ type: [UserMediaRecordSchema], default: undefined })
  mediasInList?: UserMediaRecord[];

  @Prop({ type: [UserMediaRecordSchema], default: undefined })
  likedMedias?: UserMediaRecord[];
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
