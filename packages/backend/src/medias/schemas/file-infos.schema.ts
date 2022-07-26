import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FileInfos {
  isProcessing: boolean;
  maxQualilty: number;
  audioLangAvaliables: string[];
  maxQualiltyTag: string;
  Sduration: number;
  thumbnailsGenerated: boolean;
  extraQualities: number[];
  location: string;
}

export const FileInfosSchema = SchemaFactory.createForClass(FileInfos);
