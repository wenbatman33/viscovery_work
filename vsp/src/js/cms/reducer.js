import * as types from './types';

const initialState = {
  countries: [],
  series: [],
  videos: [],
  uploads: [],
  status: [],
  counts: [],
  message: null,
  models: [
    {
      model_id: 1,
      model_name: 'face',
    },
    {
      model_id: 6,
      model_name: 'object',
    },
    {
      model_id: 7,
      model_name: 'scene',
    },
  ],
};

export default function cms(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_COUNTRIES: {
      return Object.assign({}, state, {
        countries: action.countries,
      });
    }
    case types.REQUEST_SERIES_LIST: {
      return state;
    }
    case types.RECEIVE_SERIES_LIST: {
      const element = action.series.find(series => series.is_default);
      if (element) {
        element.series_name = 'Default';
      }
      return Object.assign({}, state, {
        series: action.series,
      });
    }
    case types.CREATE_SERIES: {
      return Object.assign({}, state, {
        series: [...state.series, action.series],
      });
    }
    case types.UPDATE_SERIES: {
      const series = state.series.slice();
      const index = series.findIndex(s => s.series_id === action.series.series_id);
      if (index !== -1) {
        series.splice(index, 1, action.series);
      }
      return Object.assign({}, state, {
        series,
      });
    }
    case types.DELETE_SERIES: {
      const series = state.series.filter(s => s.series_id !== action.series.series_id);
      return Object.assign({}, state, {
        series,
      });
    }
    case types.RECEIVE_SERIES: {
      const series = state.series.slice();
      let index = series.findIndex(s => s.series_id === action.series.series_id);
      if (index === -1) {
        index = series.findIndex(
          s => !s.series_id && s.series_name === action.series.series_name);
      }
      if (index === -1) {
        series.push(action.series);
      } else {
        series.splice(index, 1, action.series);
      }
      return Object.assign({}, state, {
        series,
      });
    }
    case types.REQUEST_VIDEO_LIST: {
      return state;
    }
    case types.RECEIVE_VIDEO_LIST: {
      for (const video of action.videos) {
        video.timestamp = new Date(video.update_time);
      }
      const videos = state.videos.filter(video => video.series_id !== action.series.series_id);
      Array.prototype.push.apply(videos, action.videos);
      return Object.assign({}, state, {
        videos,
      });
    }
    case types.CREATE_VIDEO: {
      const series = state.series.slice();
      const index = series.findIndex(s => s.series_id === action.video.series_id);
      if (index !== -1) {
        const object = Object.assign({}, series[index], {
          summary: {
            total: series[index].summary.total + 1,
            available: series[index].summary.available,
          },
        });
        series.splice(index, 1, object);
      }
      return Object.assign({}, state, {
        series,
        videos: [...state.videos, action.video],
      });
    }
    case types.UPDATE_VIDEO: {
      const series = state.series.slice();
      const videos = state.videos.slice();
      const uploads = state.uploads.slice();
      const element = videos.find(video => video.video_id === action.video.video_id);
      if (element && element.series_id !== action.video.series_id) {
        let index = series.findIndex(s => s.series_id === element.series_id);
        if (index !== -1) {
          const object = Object.assign({}, series[index], {
            summary: {
              total: series[index].summary.total - 1,
              available: series[index].summary.available - (element.status > 1 ? 1 : 0),
            },
          });
          series.splice(index, 1, object);
        }
        index = series.findIndex(s => s.series_id === action.video.series_id);
        if (index !== -1) {
          const object = Object.assign({}, series[index], {
            summary: {
              total: series[index].summary.total + 1,
              available: series[index].summary.available + (action.video.status > 1 ? 1 : 0),
            },
          });
          series.splice(index, 1, object);
        }
      }
      const index = state.videos.findIndex(video => video.video_id === action.video.video_id);
      if (index !== -1) {
        videos.splice(index, 1, action.video);
      }
      const uploadIndex = uploads.findIndex(
        upload => upload.video.video_id === action.video.video_id);
      if (uploadIndex !== -1) {
        const newUpload = Object.assign({}, uploads[uploadIndex], {
          series: action.video.series_id,
          video: { ...uploads[uploadIndex].video, series_id: action.video.series_id },
        });
        uploads.splice(uploadIndex, 1, newUpload);
      }
      return Object.assign({}, state, {
        series,
        videos,
        uploads,
      });
    }
    case types.DELETE_VIDEO: {
      const series = state.series.slice();
      const index = series.findIndex(s => s.series_id === action.video.series_id);
      if (index !== -1) {
        const object = Object.assign({}, series[index], {
          summary: {
            total: series[index].summary.total - 1,
            available: series[index].summary.available - (action.video.status > 1 ? 1 : 0),
          },
        });
        series.splice(index, 1, object);
      }
      const videos = state.videos.filter(video => video.video_id !== action.video.video_id);
      return Object.assign({}, state, {
        series,
        videos,
      });
    }
    case types.RECEIVE_VIDEO: {
      const series = state.series.slice();
      const videos = state.videos.slice();
      let index = videos.findIndex(video => video.video_id === action.video.video_id);
      if (index === -1) {
        index = videos.findIndex(
          video => !video.video_id && video.video_name === action.video.video_name);
      }
      if (index === -1) {
        const seriesIndex = series.findIndex(s => s.series_id === action.video.series_id);
        if (seriesIndex !== -1) {
          const object = Object.assign({}, series[seriesIndex], {
            summary: {
              total: series[seriesIndex].summary.total + 1,
              available: series[seriesIndex].summary.available + (action.video.status > 1 ? 1 : 0),
            },
          });
          series.splice(seriesIndex, 1, object);
        }
        /* eslint-disable no-param-reassign */
        action.video.timestamp = new Date(action.video.update_time);
        /* eslint-enable */
        videos.push(action.video);
      } else {
        if (videos[index].status !== action.video.status) {
          const seriesIndex = series.findIndex(s => s.series_id === action.video.series_id);
          if (seriesIndex !== -1) {
            const object = Object.assign({}, series[seriesIndex], {
              summary: {
                total: series[seriesIndex].summary.total,
                available: series[seriesIndex].summary.available
                  + (action.video.status > 1 ? 1 : 0),
              },
            });
            series.splice(seriesIndex, 1, object);
          }
        }
        /* eslint-disable no-param-reassign */
        action.video.timestamp = new Date(action.video.update_time);
        /* eslint-enable */
        videos.splice(index, 1, action.video);
      }
      return Object.assign({}, state, {
        series,
        videos,
      });
    }
    case types.PREPARE_UPLOAD: {
      let uploads = state.uploads.slice();
      const upload = {
        file: action.file,
        size: action.file.size,
        series: action.series ? parseInt(action.series, 10) : null,
        video: action.video,
        status: 0,
        progress: 0,
        created: new Date(),
        episode: action.episode,
        modelIds: action.modelIds,
        faceModel: action.faceModel,
      };
      if (typeof action.video !== 'undefined') {
        const index = uploads.findIndex(u => u.video.video_id === action.video.video_id);
        uploads.splice(index, 1, upload);
      } else {
        uploads = [...uploads, upload];
      }

      return Object.assign({}, state, {
        uploads,
      });
    }

    case types.REDO_UPLOAD: {
      const uploads = state.uploads.slice();
      const upload = {
        file: action.upload.file,
        size: action.upload.file.size,
        series: action.upload.series ? parseInt(action.upload.series, 10) : null,
        video: action.upload.video,
        status: 0,
        progress: 0,
        created: new Date(),
        episode: action.upload.episode,
        modelIds: action.upload.modelIds,
        faceModel: action.upload.faceModel,
      };

      const index = uploads.findIndex(u => u.created === action.upload.created);
      uploads.splice(index, 1, upload);

      return Object.assign({}, state, {
        uploads,
      });
    }

    case types.REMOVE_UPLOAD: {
      const uploads = state.uploads.slice();
      const index = uploads.indexOf(action.upload);
      if (index !== -1) {
        uploads.splice(index, 1);
      }
      return Object.assign({}, state, {
        uploads,
      });
    }
    case types.START_UPLOAD: {
      const uploads = state.uploads.slice();
      const index = uploads.indexOf(action.upload);
      uploads[index].status = 1;
      return Object.assign({}, state, {
        uploads,
      });
    }
    case types.PROGRESS_UPLOAD: {
      const uploads = state.uploads.slice();
      const index = uploads.indexOf(action.upload);
      uploads[index].progress = action.progress;
      return Object.assign({}, state, {
        uploads,
      });
    }
    case types.FINISH_UPLOAD: {
      const uploads = state.uploads.slice();
      const index = uploads.indexOf(action.upload);
      if (index !== -1) {
        if (action.success === 1) {
          uploads[index].status = 2;
        } else if (action.success === 2) {
          uploads[index].status = 3;
          uploads[index].progress = 0;
          uploads[index].errorCode = action.errorCode;
        } else if (action.success === 3) {
          uploads[index].status = 4;
          uploads[index].progress = 0;
        }
      }
      return Object.assign({}, state, {
        uploads,
      });
    }
    case types.UPDATE_MESSAGE: {
      return Object.assign({}, state, {
        message: action.message,
      });
    }
    case types.RECEIVE_STATUS: {
      const videos = state.status.filter(video => video.video_id !== action.video.video_id);
      switch (action.video.status) {
        case 3:
        case 4: {
          for (const job of action.video.jobs) {
            if (job.predict_end_time) {
              const timestamp = new Date(job.predict_end_time);
              if (!action.video.timestamp || timestamp > action.video.timestamp) {
                /* eslint-disable no-param-reassign */
                action.video.timestamp = timestamp;
                /* eslint-enable */
              }
            }
          }
          break;
        }
        case 5:
        case 6: {
          for (const job of action.video.jobs) {
            if (job.update_time) {
              const timestamp = new Date(job.update_time);
              if (!action.video.timestamp || timestamp > action.video.timestamp) {
                /* eslint-disable no-param-reassign */
                action.video.timestamp = timestamp;
                /* eslint-enable */
              }
            }
          }
          break;
        }
        default:
          break;
      }
      videos.push(action.video);
      return Object.assign({}, state, {
        status: videos,
      });
    }
    case types.RECEIVE_STATUS_LIST: {
      const counts = state.counts.slice();
      const index = counts.findIndex(count => count.status === action.status);
      if (index === -1) {
        counts.push({
          status: action.status,
          count: action.response.count,
        });
      } else {
        counts.splice(index, 1, {
          status: action.status,
          count: action.response.count,
        });
      }
      for (const video of action.response.status) {
        switch (video.status) {
          case 3:
          case 4: {
            for (const job of video.jobs) {
              if (job.predict_end_time) {
                const timestamp = new Date(job.predict_end_time);
                if (!video.timestamp || timestamp > video.timestamp) {
                  video.timestamp = timestamp;
                }
              }
            }
            break;
          }
          case 5:
          case 6: {
            for (const job of video.jobs) {
              if (job.update_time) {
                const timestamp = new Date(job.update_time);
                if (!video.timestamp || timestamp > video.timestamp) {
                  video.timestamp = timestamp;
                }
              }
            }
            break;
          }
          default:
            break;
        }
      }
      const videos = state.status.filter(video => video.status !== action.status);
      Array.prototype.push.apply(videos, action.response.status);
      return Object.assign({}, state, {
        status: videos,
        counts,
      });
    }
    default: {
      return state;
    }
  }
}
