/**
 * Created by amdis on 2017/2/8.
 */
import { timeUtil, urlUtil } from 'utils';
import { AD_POD_TIME_OPTIONS } from '../../constants';

export const addHostPrefix = (path, host) => urlUtil.addHostPrefix(path, host);

// Note : this is a mutation function
export const removeAdsFromVideo = (video, removeAdIds) => {
  const removeIndex = [];
  if (Array.isArray(removeAdIds)) {
    for (let adIx = 0; adIx < video.content.length; adIx += 1) {
      const adId = video.content[adIx].id;
      if (removeAdIds.includes(adId)) {
        removeIndex.push(adIx);
      }
    }
  }
  for (let i = removeIndex.length - 1; i > -1; i -= 1) {
    video.content.splice(i, 1);
  }

  return video;
};

export const getDefaultSelectedTime = options => (options[1].value);
export const getTimeFromLocation = location => (location.query.t);

export const timeToDays = (time) => {
  switch (time) {
    case AD_POD_TIME_OPTIONS.ALL:
      return null;
    case AD_POD_TIME_OPTIONS.WITHIN_1_WEEK:
      return 7;
    case AD_POD_TIME_OPTIONS.WITHIN_2_WEEKS:
      return 14;
    case AD_POD_TIME_OPTIONS.WITHIN_1_MONTH:
      return 30;
    default:
      return 7;
  }
};

export const isTimeChanged = (location1, location2) => (
  location1.query.t !== location2.query.t
);


/**
 * extract ad IDs from selected information
 * @param videos
 * @param selected {
        type: type,
        values : [
          { videoId : info.videoId,
            index : [info.index]
          }
        ]
      }
 */

export const timeToFrame = (fps, hour, min, sec) => {
  const seconds = Number(sec) + (Number(min) * 60) + (Number(hour) * 60 * 60);

  return (seconds * fps) + 1;
};

export const extractVideosIds = videos => (
  videos.map(video => video.video_id)
);

export const downloadVad = (url, fileName) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
};

export const getSelectedNumber = (selected) => {
  if (selected.values.length === 0) { return 0; }
  let sum = 0;

  selected.values.forEach((v) => {
    sum += v.index.length;
  });

  return sum;
};

export const frameToSeconds = (frame, fps) => (
  frame / fps
);

export const adIDsFromSelected = (videos, selected) => {
  const adIDs = [];
  selected.values.forEach((video) => {
    const v = videos.find(vi => vi.video_id === video.videoId);
    video.index.forEach(index => adIDs.push(v.content[index].id));
  });
  return adIDs;
};

export const updateAd = (videos, updatedAd) => {
  const newVideos = videos.slice();
  if (Array.isArray(updatedAd)) {
    for (const ad of updatedAd) {
      const videoIndex = newVideos.findIndex(video => video.video_id === ad.video_id);
      for (const content of ad.content) {
        const contentIndex = newVideos[videoIndex].content.findIndex(_ad => _ad.id === content.id);
        newVideos[videoIndex].content[contentIndex] = content;
      }
      newVideos[videoIndex].updated_time = ad.updated_time;
    }
  } else {
    const videoIx = newVideos.findIndex(video => video.video_id === updatedAd.video_id);
    const updateIx = newVideos[videoIx].content.findIndex(ad => ad.id === updatedAd.content.id);
    newVideos[videoIx].content[updateIx] = updatedAd.content;
    newVideos[videoIx].updated_time = updatedAd.updated_time;
  }
  return newVideos;
};


export const getAdContentsByIDs = (videos, adIDs) => {
  const contents = [];
  for (const video of videos) {
    for (const ad of video.content) {
      if (adIDs.includes(ad.id)) { contents.push(ad); }
    }
  }
  return contents;
};

export const convertToBatchUpdateFormat = (content) => {
  const obj = Object.assign({}, content);
  delete obj.id;
  return {
    id: content.id,
    content: obj,
  };
};

export const frameToTimeString = (frame, fps, rounding, format = '%H:%M:%S') => {
  if (!frame || !fps) { return ''; }
  const processing = (second) => {
    switch (rounding) {
      case 'round':
        return Math.round(second);
      case 'ceil':
        return Math.ceil(second);
      case 'floor':
        return Math.floor(second);
      default:
        return second;
    }
  };
  const milliseoncds = processing((frame - 1) / fps) * 1000;
  const timeObj = timeUtil.msToTimeObject(parseInt(milliseoncds, 10));
  const timeStr = timeUtil.timeObjectToString(timeObj, format);
  return timeStr;
};

export const frameToTimeOffset = (frame, fps, transform) => {
  const offset = (frame - 1) / fps;
  return (transform ? transform(offset) : offset) * 1000;
};

export const addSelectedByVideoId = (currentSelected, videos, videoId) => {
  const nextSelected = Object.assign({}, currentSelected);
  const indexInSelect = currentSelected.values.findIndex(video => video.videoId === videoId);
  const videoIx = videos.findIndex(video => video.video_id === videoId);
  const selectedIndexArr = Array(videos[videoIx].content.length).fill(0).map((ad, index) => index);

  if (indexInSelect < 0) {
    nextSelected.values.push(
      {
        videoId,
        index: selectedIndexArr,
      }
    );
  } else {
    nextSelected.values[indexInSelect].index = selectedIndexArr;
  }

  return nextSelected;
};

export const removeSelectedByVideoId = (currentSelected, videoId) => {
  const nextSelected = Object.assign({}, currentSelected);
  const index = currentSelected.values.findIndex(video => video.videoId === videoId);
  nextSelected.values.splice(index, 1);
  return nextSelected;
};

export const timeStringToFrame = (timeStr, fps) => {
  const timeElements = timeStr.split(':');
  const frame = (((parseInt(timeElements[0], 10) * 3600) + (parseInt(timeElements[1], 10) * 60)
    + parseInt(timeElements[2], 10)) * fps) + 1;

  return frame;
};

export const startPosToTimeString = (frame, fps) => frameToTimeString(frame, fps, 'ceil');

export const endPosToTimeString = (frame, fps) => frameToTimeString(frame, fps, 'ceil');

export const startPosToTimeOffset = (frame, fps) => frameToTimeOffset(frame, fps, Math.ceil);

export const pageNumToOffset = (page, limit) => (page - 1) * limit;

export const offsetToPageNum = (offset, limit) => (offset / limit) + 1;

export const deleteAdsCountFromResp = (responseAds) => {
  let removedAdCount = 0;

  Object.keys(responseAds).forEach((videoId) => {
    const removeIds = responseAds[videoId];
    removedAdCount += removeIds.length;
  });

  return removedAdCount;
};

export const getPageAdsCount = (videos) => {
  let count = 0;

  videos.forEach((v) => {
    count += v.content.length;
  });

  return count;
};
