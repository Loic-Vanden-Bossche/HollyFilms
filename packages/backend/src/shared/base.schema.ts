import { Prop, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";

@Schema()
export class BaseSchema {
  @Prop()
  updatedAt?: Date;

  @Prop()
  createdAt?: Date;
}

@Schema()
export class BaseIdSchema extends BaseSchema {
  @Prop({ auto: true, type: MongooseSchema.Types.ObjectId })
  _id?: string;
}
