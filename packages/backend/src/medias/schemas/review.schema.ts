import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataProfile } from './profile.schema';

@Schema()
export class Review {
  @Prop()
  author: DataProfile;

  @Prop()
  rating: number;

  @Prop()
  content: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
