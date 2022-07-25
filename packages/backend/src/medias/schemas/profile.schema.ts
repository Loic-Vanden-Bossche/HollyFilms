import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Profile {
  @Prop()
  name: string;

  @Prop()
  profile_path: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
