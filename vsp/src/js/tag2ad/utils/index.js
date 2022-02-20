import R from 'ramda';

/**
 * Created by amdis on 2017/1/18.
 */
import { translate } from 'react-i18next';
import { AdCategory, Filter } from '../models';
import {
  API_LOCALE, NAME,
  AD_CHANCE_SPACE_UNIT,
  START_DURATION_PERCENTGE,
  END_DURATION_PERCENTAGE,
} from '../constants';

import {
  ApiConfigHOC,
} from '../../shared/hoc';

/**
 *
 * @param categories instance of mode/AdCategory array
 * @param id category id
 * @return {null} AdCateogry
 */
export const findCategoryById = (categories, id) => {
  if (!categories || categories.length < 0) {
    return null;
  }

  if (!(categories[0] instanceof AdCategory)) {
    throw new Error('expect argument categories to be of array of AdCategory instance');
  }

  for (const c of categories) {
    if (!c.hasChildren() && c.id() === id) {
      return c;
    }

    if (!c.hasChildren() && c.subCategoryId() === id) {
      return c;
    }

    if (c.hasChildren()) {
      const result = findCategoryById(c.children(), id);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
};

/**
 * for AdSetting and AdPodManagement
 * @param currentSelected
 * @param info
 * @param allowMultiple
 * @param type
 * @return {*}
 */
export const getNextSelected = (currentSelected, info, allowMultiple = true, type = 'checked') => {
  let nextSelected = null;

  // batch mode
  if (allowMultiple) {
    // nextSelected = Object.assign({}, currentSelected, { type });
    nextSelected = R.clone({
      ...currentSelected,
      type,
    });
    const videoIx = nextSelected.values.findIndex(video => video.videoId === info.videoId);
    if (videoIx < 0) {
      nextSelected.values.push({ videoId: info.videoId, index: [info.index] });
    } else if (!info.selected) {
        // add item
      const item = nextSelected.values[videoIx];
      item.index.push(info.index);
      nextSelected.values[videoIx] = item;
    } else {
        // remove item
      const itemIx = nextSelected.values[videoIx].index.indexOf(info.index);
      nextSelected.values[videoIx].index.splice(itemIx, 1);
        // remove video data if no chance of the video is selected
      if (nextSelected.values[videoIx].index.length === 0) {
        nextSelected.values.splice(videoIx, 1);
      }
    }
  } else {
    // single edit mode, change selected
    nextSelected = Object.assign({},
      {
        type,
        values: [
          {
            videoId: info.videoId,
            index: [info.index],
          },
        ],
      });
  }

  return nextSelected;
};


export const getDefaultCategoryOption = (categories, subCategoryId) => {
  const category = subCategoryId ? findCategoryById(categories, subCategoryId) : categories[0];
  if (category == null) {
    return null;
  }

  if (category.hasChildren()) {
    return getDefaultCategoryOption(category.children());
  }

  return getCategoryOption(category);
};

/**
 *
 * @param categories instance of mode/AdCategory array
 * @param id category id
 * @return {null} AdCategory
 */
export const findCategoryNameById = (categories, id) => {
  const placeholder = '-----';
  if (!categories || categories.length < 1) {
    return placeholder;
  }

  const category = findCategoryById(categories, id);

  return !category ? placeholder : category.name();
};

export const findFormById = (forms, id) => {
  for (const form of forms) {
    if (form.id() === id) {
      return form;
    }
  }

  return null;
};

export const formatAdUpdateTime = (timeStr, locale = API_LOCALE.ZH_TW) => {
  switch (locale) {
    case API_LOCALE.ZH_TW:
    case API_LOCALE.ZH_CN:
      return (new Date(timeStr)).toLocaleString('zh');
    default:
      return (new Date(timeStr)).toLocaleString('en-US');
  }
};

export const addQueryParam = (url, paramName, value) => {
  if (!url || !paramName) {
    throw new Error('utils.js addQueryString : "url" and "paramName" must be given.');
  }

  if (value === 'undefined' || value === null) {
    throw new Error('utils.js addQueryString : param "value" must be given.');
  }

  const v = Array.isArray(value) ? JSON.stringify(value) : value;
  if (url.indexOf('?') > 0) {
    return `${url}&${paramName}=${v}`;
  }

  return `${url}?${paramName}=${v}`;
};

export const getTagNameByLocale = (tag, locale) => {
  if (!tag) {
    return '';
  }
  switch (locale) {
    case API_LOCALE.ZH_TW:
      return tag.name_zh_tw || tag.name;
    case API_LOCALE.ZH_CN:
      return tag.name_zh_cn || tag.name;
    default:
      return tag.name;
  }
};

export const findBrandById = (brands, id) => {
  const brand = brands.find(b => b.id === id);

  return brand;
};

export const getDefaultAdFormOption = (forms, id) => {
  const form = id ? findFormById(forms, id) : forms[0];
  if (!form) {
    return null;
  }

  return { label: form.name(), value: form.id() };
};

export const getFilterById = (filters, filterId) => {
  for (const filter of filters) {
    if (filter.hasChildren()) {
      const foundItem = getFilterById(filter.children(), filterId);
      if (foundItem) {
        return foundItem;
      }
    } else if (filter.id() === filterId) {
      return filter;
    }
  }

  return null;
};

export const hasValue = param => param !== undefined && param !== null;

export const localize = (component, moduleName = NAME) => translate(moduleName)(component);

export const isObjectEmpty = (obj) => {
  if (obj === undefined || obj === null) {
    return true;
  }

  if (typeof obj !== 'object') {
    throw new Error('Error data type of param, must be an object.');
  }

  if (Object.keys(obj).length === 0) {
    return true;
  }

  return false;
};

export const isFilterCreator = (filter, userId) => {
  let f = filter;
  if (!(filter instanceof Filter)) {
    f = new Filter(filter);
  }

  if (f && f.isShared() === false && f.uid() === userId) {
    return true;
  }

  return false;
};

export const getFilterOption = (filter, userId) => {
  if (filter === 'undefined' || filter === null) {
    return null;
  }


  if (filter.hasChildren()) {
    return {
      label: filter.name(),
      value: filter.id() || filter.name(),
      items: filter.children().map(child => getFilterOption(child, userId)),
      shared: filter.isShared(),
      creator: isFilterCreator(filter, userId),
    };
  }
  return {
    key: filter.id(),
    label: filter.name(),
    value: filter.id(),
    shared: filter.isShared(),
    creator: isFilterCreator(filter, userId),
  };
};

export const getCategoryOption = (category) => {
  if (category === 'undefined' || category === null) {
    return null;
  }
  if (category.hasChildren()) {
    return {
      label: category.name(),
      value: category.id() || category.name(),
      items: category.children().map(child => getCategoryOption(child)),
      shared: category.isShared(),
    };
  }
  return {
    key: category.id(),
    label: category.name(),
    value: category.id(),
    shared: category.isShared(),
  };
};

export const getSelectedVideoCount = (selectedVideos) => {
  if (!selectedVideos) {
    return 0;
  }

  const lengths = Object.values(selectedVideos).map(videos => videos.length);
  return lengths.reduce((x, y) => x + y, 0);
};

export const dateToString = (date) => {
  if (date) {
    const iso = date.toISOString();
    return iso.split('T')[0].replace(/-/g, '/');
  }
  return '';
};

export const dateToQueryString = (date) => {
  if (date) {
    return date.toISOString().split('T')[0];
  }
  return '';
};

export const getSelectedVideoIds = (selectedVideoObj) => {
  let videoArr = [];
  // get all video objects
  Object.values(selectedVideoObj).forEach(
    (seriesVideos) => { videoArr = videoArr.concat(seriesVideos); }
  );

  return videoArr.map(v => v.video_id);
};

export const handleLeftPaneOnBlur = (event, document, callback, excludeClass) => {
  const currentTarget = event.currentTarget;

  if (callback) {
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (excludeClass && activeElement.classList.contains(excludeClass)) {
        return;
      }
      if (!currentTarget.contains(activeElement)) {
        callback();
      }
    }, 0);
  }
};

export const totalVideosCount = (series) => {
  if (Array.isArray(series)) {
    return series.map(s => s.summary.recognized).reduce((x, y) => x + y, 0);
  }

  return 0;
};

export const toChanceSearchPayload = (
  videos, filterIDs, config, pageNum, countsPerPage, hash, advancedFilter
) => {
  const payload = {
    filter_content: {},
  };

  if (!hasValue(pageNum)) {
    throw new Error('param "pageNum" must be provided');
  }
  if (!hasValue(countsPerPage)) {
    throw new Error('param "countsPerPage" must be provided');
  }

  payload.page = pageNum;
  payload.count = countsPerPage;

  if (Array.isArray(filterIDs)) {
    payload.filter_ids = filterIDs.length > 0 ? filterIDs : null;
  } else {
    throw new Error('param "filterIDs" must be provided and of type "array"');
  }


  if (hasValue(videos) && Object.keys(videos).length > 0) {
    payload.video_map = {};
    Object.keys(videos).forEach((seriesId) => {
      const videoIDArr = videos[seriesId];
      if (videoIDArr.length > 0) {
        payload.video_map[seriesId] = videoIDArr.map(v => v.video_id);
      }
    });
  }

  if (config) {
    const content = payload.filter_content;
    if (hasValue(config.interval)) {
      content.intervals_second = Number(config.interval);
    }

    if (hasValue(config.limit)) {
      content.max_ads = Number(config.limit);
    }

    const durationStart = config.duration.start;
    const durationEnd = config.duration.end;
    const durationUnit = config.duration.unit;

    if (hasValue(durationStart) || hasValue(durationEnd)) {
      const start = hasValue(durationStart) && Boolean(durationStart) ?
        Number(durationStart) : null;
      const end = hasValue(durationEnd) && Boolean(durationEnd) ? Number(durationEnd) : null;
      const addParam = start || end;

      if (addParam && durationUnit === AD_CHANCE_SPACE_UNIT.PERCENTAGE) {
        content.time_space_percent = {
          s: start || START_DURATION_PERCENTGE,
          e: end || END_DURATION_PERCENTAGE,
        };
      }

      if (addParam && durationUnit === AD_CHANCE_SPACE_UNIT.TIME) {
        const startInSeconds = start ? start * 60 : 0;
        const endInSeconds = end ? end * 60 : 0;
        content.time_exclude_second = { s: startInSeconds, e: endInSeconds };
      }
    }
  }

  payload.filter_content.video_advanced = advancedFilter;

  if (hasValue(hash)) {
    payload.redis_search_key = hash;
  }

  return payload;
};

export const isAllVideosSelected = (selectedVideos, seriesList) => {
  const selectedCount = getSelectedVideoCount(selectedVideos);
  const totalCount = totalVideosCount(seriesList);

  return selectedCount >= totalCount;
};

export const getUserIdByUser = user => (user ? user.uid : null);

export const scrollNodeIntoView = (node, behavior = 'smooth') => {
  if (hasValue(node)) {
    node.scrollIntoView({ behavior });
  }
};

export const totalPageNum = (itemCount, pageLimit) => Math.ceil(itemCount / pageLimit);

export const connectApiConfig = component => ApiConfigHOC(component);

export const invokeDownloadWindow = (url, fileName) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
};

const timeStringReg = /^\d{2}:[0-5]\d:[0-5]\d$/;
export const isTimeStringValid = timeString => timeStringReg.test(timeString);
