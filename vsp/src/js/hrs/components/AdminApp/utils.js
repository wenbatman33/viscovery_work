import routerUtil from 'utils/routerUtil';

export const toVideo = (videoId) => { routerUtil.pushHistory(`/hrs/admin/episode/${videoId}`); };
export const toUser = (userId) => { routerUtil.pushHistory(`/hrs/admin/member/${userId}`); };
export const toVideoClick = videoId => () => {
  toVideo(videoId);
};
export const toUserClick = userId => () => {
  toUser(userId);
};

const langMapping = {
  enus: 'name',
  zhcn: 'name_zh_cn',
  zhtw: 'name_zh_tw',
};

export const combineModelIdBrandId = modelId => brandId =>
  ((modelId && brandId) ? `${modelId}-${brandId}`.toLowerCase() : '');

export const translateTask = (dict, locale) => (task) => {
  const nameLocale = langMapping[locale];
  const key = combineModelIdBrandId(task.model_id)(task.brand_id);
  if (dict[key]) {
    if (dict[key][nameLocale]) {
      return {
        ...task,
        brand_name: dict[key][nameLocale],
        brand_id: dict[key].id,
      };
    }
  }

  return {
    ...task,
    brand_name: task.brand_id,
  };
};
