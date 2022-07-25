import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FileInfos {
  isProcessing: boolean;
  maxQualilty: number;
  audioLangAvaliables: Array<string>;
  maxQualiltyTag: string;
  Sduration: number;
  thumbnailsGenerated: boolean;
  extraQualities: Array<number>;
  location: string;
}

export const FileInfosSchema = SchemaFactory.createForClass(FileInfos);
