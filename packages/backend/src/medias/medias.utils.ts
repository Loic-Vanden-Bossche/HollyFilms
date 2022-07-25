import { Media } from './schemas/media.schema';
import { AdminMedia } from './medias.service';

type MediaType = 'movie' | 'tv';
type MediaWithType = { data: Media; mediaType: MediaType };

const getMediaType = (media: Media): MediaType => {
  return media.tvs ? 'tv' : 'movie';
};

const formatOneMedia = (media: Media): MediaWithType => {
  return {
    data: media,
    mediaType: getMediaType(media),
  };
};

const formatAdminMedia = (media: MediaWithType): AdminMedia => {
  return {
    _id: 'media.data._id',
    title: media.data.title,
    backdrop_path: media.data.backdrop_path,
    release_date: media.data.release_date,
    mediaType: media.mediaType,
    fileInfos: media.data.fileInfos,
  };
};

const formatManyAdminMedias = (medias: MediaWithType[]): AdminMedia[] =>
  medias.map(formatAdminMedia);

const formatManyMedias = (medias: Media[]): MediaWithType[] =>
  medias.map(formatOneMedia);

export {
  MediaType,
  MediaWithType,
  getMediaType,
  formatManyMedias,
  formatOneMedia,
  formatAdminMedia,
  formatManyAdminMedias,
};
