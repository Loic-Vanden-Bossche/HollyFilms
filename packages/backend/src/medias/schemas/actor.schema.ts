// { name: string; character: string; profile_path: string }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataProfile } from './profile.schema';

@Schema()
export class Actor extends DataProfile {
  @Prop()
  character: string;
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
