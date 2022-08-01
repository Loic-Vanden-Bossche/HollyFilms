import { FileInfos } from './file-infos.model';

export interface Episode {
  name: string;
  index: number;
  overview: string;
  still_path: string;
  runtime?: number;
  vote_average: number;
  available: boolean;
  queued?: boolean;
  releaseDate: Date;
  dateAdded?: Date;
  fileInfos?: FileInfos;
  watchedTime?: number;
}
