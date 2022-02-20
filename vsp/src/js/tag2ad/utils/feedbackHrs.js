import R from 'ramda';
import {
  arrayToObject,
} from 'utils/dataTypeUtil';

export const mergeIndexList = preList => list => R.uniq([
  ...preList,
  ...list,
]);

export const videoFinder = videoId => item => item.videoId === videoId;

export const reduceMergeDisabledList = preDisabledList => disabledList => (
  disabledList.reduce(
    (pV, cV) => {
      if (pV.find(videoFinder(cV.videoId))) {
        return pV.map((item) => {
          if (item.videoId === cV.videoId) {
            return {
              ...item,
              index: mergeIndexList(item.index)(cV.index),
            };
          }
          return item;
        });
      }
      return [
        ...pV,
        cV,
      ];
    },
    preDisabledList
  )
);

export const mergeDisabledList = state => ({
  disabledList: reduceMergeDisabledList(state.disabledList)(state.selected.values),
});

const mapSelectedChances = R.map(value => (
  value.index.map(idx => ({
    videoId: value.videoId,
    index: idx,
  }))
));

export const flatSelectedChances = R.compose(
  R.flatten,
  mapSelectedChances
);

const tagIdGetter = tagInfo => tagInfo.tag_id;

export const mapChancesToData = videosDict => R.map(chance => ({
  video_id: chance.videoId,
  brand_ids: videosDict[chance.videoId].chances[chance.index].tag_infos.map(tagIdGetter),
  key_moment: {
    start: videosDict[chance.videoId].chances[chance.index].start,
    end: videosDict[chance.videoId].chances[chance.index].end,
  },
}));

export const getFeedbackData = (selectedList, videos) => {
  const flattenSelectedChances = flatSelectedChances(selectedList);
  const videosDict = arrayToObject('video_id')(videos);
  const mapper = mapChancesToData(videosDict);

  return mapper(flattenSelectedChances);
};
