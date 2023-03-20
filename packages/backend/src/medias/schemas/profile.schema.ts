import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class DataProfile {
  @Prop()
  name: string;

  @Prop()
  profile_path: string;
}

export const DataProfileSchema = SchemaFactory.createForClass(DataProfile);
