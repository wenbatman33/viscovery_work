/**
 * Created Date : 2016/9/21
 * Copyright (c) Viscovery.co
 * Author : Amdis Liu <amdis.liu@viscovery.co>
 * Contributor :
 * Description : Pure functions to compute next state of app based on current state and given action
 */
import * as types from './types';
import { helper as adPodHelper } from './components/AdPodManagement';


const chanceSearchParamsInitState = {
  adChances: [],
  totalChanceCount: 0,
  totalChanceVideos: 0,
  lastChanceSearchParam: { videos: {}, filters: [], config: null, page: 1, hash: null },
  chanceSearchEmpty: false,
};

const adsSearchParamsInitState = {
  ads: [],
  totalAdVideos: 0,
  totalAdCount: 0,
  adSearchConfig: null,
  adsSearchEmpty: false,
  adsActivePage: 1,
};

const campaignListInitState = {
  campaigns: [],
  isCampaignExist: false,
  totalPageCount: -1,
  totalCampaignCount: 0,
  campaignNameInvalid: false,
  adHostsList: [],
};

const advancedFilterInitState = {
  hrsOptions: [
    {
      id: '1',
      text: '已完成HRS',
    },
    {
      id: '0',
      text: '無HRS',
    },
  ],
  genreOptions: [],
  playViewsOptions: [],
  runningTimeOptions: [],
  videoYearOptions: [],
  filterValues: {
    hrs: [],
    playViews: [],
    genre: [],
    runningTime: [],
    videoYear: [],
  },
};

const initialState = {
  showAlert: false,
  alertMessage: '',
  sharedFilters: [],
  customFilters: [],
  series: [],
  errorMessage: '',
  adForms: [],
  adCategories: [],
  ratios: [],
  tags: [],
  tag_brands: [],
  ...chanceSearchParamsInitState,
  videos: {},
  sharedCategories: [],
  customCategories: [],
  ...adsSearchParamsInitState,
  message: null,
  messageSuccess: true,
  ...campaignListInitState,
  allCampaignBriefs: [],
  ...advancedFilterInitState,
};

function findFilterPosById(list, id) {
  for (let i = 0; i < list.length; i += 1) {
    const filter = list[i];
    if (filter.id() === id) {
      return i;
    }
  }

  return -1;
}

export default function tag2ad(state = initialState, action) {
  let list;
  switch (action.type) {
    case types.RECEIVE_BRAND_LIST: {
      return Object.assign({}, state, {
        brands: action.brands,
      });
    }
    case types.RECEIVE_AD_CHANCES: {
      return Object.assign({}, state, {
        adChances: action.results,
        chanceSearchEmpty: action.results.length === 0,
        totalChanceCount: action.adCount,
        totalChanceVideos: action.videoCount,
        lastChanceSearchParam: action.params,
      });
    }

    case types.RECEIVE_AD_CHANCES_FAIL: {
      return Object.assign({}, state, { errorMessage: action.message });
    }

    case types.RECEIVE_FILTER_LIST : {
      return Object.assign({}, state,
        {
          sharedFilters: action.sharedFilters,
          customFilters: action.customFilters,
        }
      );
    }

    case types.CLEAR_CUR_FILTER :
      return Object.assign({}, state, { filter: null });

    case types.RECEIVE_FILTER :
      return Object.assign({}, state, { filter: action.filter });

    case types.SET_FILTER :
      return Object.assign({}, state, { filter: action.filter });

    case types.CREATE_FILTER_SUCCESS : {
      return Object.assign({}, state,
        {
          customFilters: [...state.customFilters, action.filter],
          filter: action.filter,
        }
      );
    }

    case types.UPDATE_FILTER_SUCCESS : {
      list = [].concat(state.customFilters);
      const updateIndex = findFilterPosById(list, action.id);
      if (updateIndex > -1) {
        list = [
          ...list.slice(0, updateIndex),
          action.filter,
          ...list.slice(updateIndex + 1),
        ];
      }
      return Object.assign({}, state, { customFilters: list, filter: action.filter });
    }

    case types.DELETE_FILTER_SUCCESS : {
      list = state.customFilters;
      const index = findFilterPosById(list, action.id);
      if (index > -1) {
        list = [
          ...state.customFilters.slice(0, index),
          ...state.customFilters.slice(index + 1),
        ];
      }
      return Object.assign({}, state, { customFilters: list, filter: null });
    }

    case types.RECEIVE_SERIES :
      return Object.assign({}, state, { series: action.series });

    case types.REQ_SERIES_FAIL :
      return Object.assign({}, state, { errorMessage: action.message });

    case types.DELETE_FILTER_FAIL :
      return Object.assign({}, state, { errorMessage: action.message });

    case types.RECEIVE_AD_FORMS :
      return Object.assign({}, state, { adForms: action.adForms });

    case types.RECEIVE_AD_CATEGORIES : {
      return Object.assign({}, state,
        {
          sharedCategories: action.shared,
          customCategories: action.custom,
        }
      );
    }

    case types.RECEIVE_RATIO_LIST:
      return Object.assign({}, state, { ratios: action.ratios });

    case types.RECEIVE_TAGS: {
      const tags = action.payload;
      let brands = [];
      tags.forEach((model) => {
        model.classes.forEach((cls) => {
          brands = brands.concat(cls.brands);
        });
      });
      return Object.assign({}, state, { tags: action.payload, tag_brands: brands });
    }

    case types.RECEIVE_SERIRES_VIDEO_LIST: {
      const videos = Object.assign({}, state.videos);
      videos[action.seriesId] = action.videos;
      return Object.assign({}, state, { videos });
    }

    case types.CLEAR_AD_SETTING_SEARCH: {
      return Object.assign({},
        state,
        {
          ...chanceSearchParamsInitState,
        }
      );
    }

    case types.RECEIVE_ALL_VIDEOS:
      return Object.assign({}, state, { videos: action.payload });

    case types.RECEIVE_ADS:
      return Object.assign({}, state,
        {
          ads: action.ads,
          totalAdVideos: action.totalAdVideos,
          totalAdCount: action.totalAdCount,
          adSearchConfig: action.config,
          adsSearchEmpty: action.ads && action.ads.length === 0,
          adsSearchFired: true,
          adsActivePage: action.page,
        }
      );

    case types.CLEAR_AD_POD_SEARCH: {
      return Object.assign(
        {}, state,
        {
          ...adsSearchParamsInitState,
        }
      );
    }

    case types.SHOW_ALERT:
      return Object.assign({}, state,
        {
          showAlert: true,
          alertMessage: action.payload,
        }
      );

    case types.DISMISS_ALERT:
      return Object.assign({}, state,
        {
          showAlert: false,
          alertMessage: '',
        }
      );

    case types.DELETE_ADS_SUCCESS: {
      if (action.all) {
        return Object.assign({}, state, adsSearchParamsInitState);
      }

      const ads = state.ads.slice();
      const deletedAds = action.ads;
      let removedAdCount = 0;

      Object.keys(deletedAds).forEach((videoId) => {
        const removeIds = deletedAds[videoId];
        removedAdCount += removeIds.length;
        const video = ads.find(v => v.video_id === Number(videoId));
        adPodHelper.removeAdsFromVideo(video, removeIds);
      });

      const nextAds = ads.filter(v => v.content.length > 0);
      const videoCountDiff = ads.length - nextAds.length;
      const nextTotalVideos = state.totalAdVideos - videoCountDiff;
      const nextTotalAdsCount = state.totalAdCount - removedAdCount;

      return Object.assign({}, state,
        {
          totalAdVideos: nextTotalVideos,
          totalAdCount: nextTotalAdsCount,
          ads: nextAds,
        }
      );
    }

    case types.DELETE_AD: {
      const ads = state.ads;
      const updateVideoIndex = ads.findIndex(v => v.video_id === action.videoId);
      const videoAdLength = ads[updateVideoIndex].content.length;

      if (videoAdLength <= 1) {
        // video contains no more ads, remove the video data and back to default mode
        const nextAds = [
          ...ads.slice(0, updateVideoIndex),
          ...ads.slice(updateVideoIndex + 1),
        ];
        return Object.assign({}, state,
          {
            ads: nextAds,
            totalVideos: state.totalAdVideos - 1,
            totalAdCount: state.totalAdCount - 1,
          }
        );
      }

      const nextAds = ads.slice();
      const content = ads[updateVideoIndex].content;
      const adIndex = content.findIndex(ad => ad.id === action.adId);
      nextAds[updateVideoIndex].content = [
        ...content.slice(0, adIndex),
        ...content.slice(adIndex + 1),
      ];
      return Object.assign({}, state,
        {
          ads: nextAds,
          totalAdCount: state.totalAdCount - 1,
        }
      );
    }

    case types.UPDATE_AD: {
      const updatedAds = action.ads;
      const nextAds = adPodHelper.updateAd(state.ads, updatedAds);
      return Object.assign({}, state,
        {
          ads: nextAds,
        }
      );
    }

    case types.UPDATE_ADS: {
      const updatedAds = action.payload;
      const nextAds = adPodHelper.updateAd(state.ads, updatedAds);
      return Object.assign({}, state,
        {
          ads: nextAds,
        }
      );
    }

    case types.SET_MESSAGE: {
      return Object.assign({}, state, {
        message: action.message,
        messageSuccess: action.messageSuccess,
      });
    }

    case types.RECEIVE_CAMPAIGNS:
      return {
        ...state,
        campaigns: action.campaigns,
        totalPageCount: action.totalPageCount,
        totalCampaignCount: action.totalCampaignCount,
      };

    case types.RECEIVE_IS_CAMPAIGN_EXIST:
      return {
        ...state,
        isCampaignExist: action.isCampaignExist,
      };

    case types.RECEIVE_ADHOSTS_LIST: {
      return Object.assign({}, state,
        {
          adHostsList: action.list,
        }
      );
    }

    case types.RECEIVE_ALL_CAMPAIGN_BRIEF: {
      return Object.assign({}, state, {
        allCampaignBriefs: action.briefs,
      });
    }

    case types.RECEIVE_GENRE_OPTIONS: {
      return {
        ...state,
        genreOptions: action.payload,
      };
    }
    case types.RECEIVE_PLAY_VIEWS_OPTIONS: {
      return {
        ...state,
        playViewsOptions: action.payload,
      };
    }
    case types.RECEIVE_VIDEO_YEAR_OPTIONS: {
      return {
        ...state,
        videoYearOptions: action.payload,
      };
    }
    case types.RECEIVE_RUNNING_TIME_OPTIONS: {
      return {
        ...state,
        runningTimeOptions: action.payload,
      };
    }
    case types.RECEIVE_HRS_OPTIONS: {
      return {
        ...state,
        hrsOptions: action.payload,
      };
    }

    case types.RECEIVE_HRS_VALUES: {
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          hrs: action.payload,
        },
      };
    }
    case types.RECEIVE_GENRE_VALUES: {
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          genre: action.payload,
        },
      };
    }
    case types.RECEIVE_PLAY_VIEWS_VALUES: {
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          playViews: action.payload,
        },
      };
    }
    case types.RECEIVE_VIDEO_YEAR_VALUES: {
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          videoYear: action.payload,
        },
      };
    }
    case types.RECEIVE_RUNNING_TIME_VALUES: {
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          runningTime: action.payload,
        },
      };
    }

    default :
      return state;
  }
}
