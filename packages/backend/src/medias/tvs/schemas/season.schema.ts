import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Episode } from "./episode.schema";
import { BaseSchema } from "../../../shared/base.schema";

@Schema({ timestamps: true, _id: false })
export class Season extends BaseSchema {
  @Prop()
  index: number;

  @Prop()
  name: string;

  @Prop()
  episode_count: number;

  @Prop()
  overview: string;

  @Prop()
  poster_path: string;

  @Prop()
  available: boolean;

  @Prop()
  dateAdded?: Date;

  @Prop()
  episodes?: Episode[];
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
