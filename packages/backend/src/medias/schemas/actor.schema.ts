// { name: string; character: string; profile_path: string }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './profile.schema';

@Schema()
export class Actor extends Profile {
  @Prop()
  character: string;
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
