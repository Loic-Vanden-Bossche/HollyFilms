import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "../../shared/base.schema";
import { SchemaTypes } from "mongoose";
import { Media } from "../../medias/media.schema";

@Schema({ timestamps: true, _id: false })
export class UserMediaRecord extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: Media.name })
  media: Media;
}

export const UserMediaRecordSchema =
  SchemaFactory.createForClass(UserMediaRecord);
