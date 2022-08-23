import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class FileInfos {
  @Prop()
  isProcessing: boolean;

  @Prop()
  maxQuality: number;

  @Prop()
  audioLangAvailable: string[];

  @Prop()
  maxQualityTag: string;

  @Prop()
  Sduration: number;

  @Prop()
  thumbnailsGenerated: boolean;

  @Prop()
  extraQualities: number[];

  @Prop()
  location: string;
}

export const FileInfosSchema = SchemaFactory.createForClass(FileInfos);
