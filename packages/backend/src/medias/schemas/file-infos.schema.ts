import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FileInfos {
  isProcessing: boolean;
  maxQuality: number;
  audioLangAvailable: string[];
  maxQualityTag: string;
  Sduration: number;
  thumbnailsGenerated: boolean;
  extraQualities: number[];
  location: string;
}

export const FileInfosSchema = SchemaFactory.createForClass(FileInfos);
