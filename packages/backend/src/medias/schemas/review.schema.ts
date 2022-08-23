import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataProfile, DataProfileSchema } from './profile.schema';

@Schema({ _id: false })
export class Review {
  @Prop({ type: DataProfileSchema })
  author: DataProfile;

  @Prop()
  rating: number;

  @Prop()
  content: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
