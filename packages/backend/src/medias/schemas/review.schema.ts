import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './profile.schema';

@Schema()
export class Review {
  @Prop()
  author: Profile;

  @Prop()
  rating: number;

  @Prop()
  content: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
