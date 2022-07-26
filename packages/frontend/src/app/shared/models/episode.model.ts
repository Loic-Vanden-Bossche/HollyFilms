import { FileInfos } from './file-infos.model';

export interface Episode {
  name: string;
  index: number;
  overview: string;
  still_path: string;
  runtime: number;
  vote_average: number;
  avaliable: boolean;
  queued?: boolean;
  dateAdded: Date;
  fileInfos: FileInfos;
}
