import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Header from './Header';
import { TagChart, TagList, TagPlayer } from '../../components';
import { NAME } from '../../constants';
import { LOCALE_EN_US, LOCALE_ZH_CN, LOCALE_ZH_TW } from '../../../app/constants';
import { getLocale } from '../../../app/selectors';
import { ApiUtil, cookieUtil, routerUtil } from '../../../utils';

import styles from './styles.scss';

const filterModels = model =>
  Boolean(cookieUtil.getViewHrs()) || model.hrs_finish;

const propTypes = {
  locale: PropTypes.string,
  match: PropTypes.object,
};

class ReportContainer extends React.Component {
  state = {
    videos: [],
    video: null,
    vtag: null,
    modelId: null,
    time: null,
  };

  componentDidMount() {
    const { videoId } = this.props.match.params;
    this.requestVideo(videoId);
    this.requestVtag(videoId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.videoId !== this.props.match.params.videoId) {
      this.setState({
        time: null,
      });
      const { videoId } = nextProps.match.params;
      this.requestVideo(videoId);
      this.requestVtag(videoId);
    }
  }

  requestVideos = (seriesId) => {
    if (seriesId) {
      ApiUtil.get(`/api/videos?series_id=${seriesId}`)
        .then((response) => {
          this.setState({
            videos: response.video_lst,
          });
        })
        .catch(() => {
          this.setState({
            videos: [],
          });
        });
    } else {
      this.setState({
        videos: [],
      });
    }
  };

  requestVideo = (videoId) => {
    if (videoId) {
      ApiUtil.get(`/api/videos/${videoId}`)
        .then((response) => {
          this.setState({
            video: response.video_lst[0],
          });
          this.requestVideos(response.video_lst[0].series_id);
        })
        .catch(() => {
          this.setState({
            video: null,
          });
        });
    } else {
      this.setState({
        video: null,
      });
    }
  };

  requestVtag = (videoId) => {
    if (videoId) {
      ApiUtil.get(`/api/vtags?video_id=${videoId}`)
        .then((response) => {
          const vtag = {
            ...response,
            models: response.models.filter(filterModels),
          };

          this.setState({
            vtag,
            modelId: vtag.models.length ? vtag.models.sort((a, b) => a.id - b.id)[0].id : null,
          });
        })
        .catch(() => {
          this.setState({
            vtag: null,
            modelId: null,
          });
        });
    } else {
      this.setState({
        vtag: null,
        modelId: null,
      });
    }
  };

  handleBack = () => {
    const { video } = this.state;
    if (video) {
      routerUtil.pushHistory(`/${NAME}/series/${video.series_id}`);
    }
  };

  handleVideoSelect = (videoId) => {
    routerUtil.pushHistory(`/${NAME}/report/${videoId}`);
  };

  handleModelSelect = (modelId) => {
    this.setState({
      modelId,
    });
  };

  handleTimeSelect = (time) => {
    if (time === this.state.time) {
      this.player.handleTimeRewind();
    } else {
      this.setState({
        time,
      });
    }
  };

  render() {
    const { handleBack, handleModelSelect, handleTimeSelect, handleVideoSelect } = this;
    const { locale } = this.props;
    const { video, vtag, modelId, time } = this.state;
    const key = ((loc) => {
      switch (loc) {
        case LOCALE_ZH_CN:
          return 'name_zh_cn';
        case LOCALE_ZH_TW:
          return 'name_zh_tw';
        case LOCALE_EN_US:
        default:
          return 'name';
      }
    })(locale);
    const videos = this.state.videos.filter(
      v => v.jobs && v.jobs.some(job => job.job_status === 3)
    ).map(v => ({
      label: v.video_name,
      value: v.video_id,
    }));
    const models = vtag
      ? vtag.models.map(model => ({
        id: model.id,
        label: model.name,
        value: model.classes.map(
          cls => cls.brands.map(brand => brand.frames.length).reduce((a, b) => a + b, 0)
        ).reduce((a, b) => a + b, 0),
      })).sort((a, b) => a.id - b.id)
      : [];
    const frames = {};
    const brands = [];
    const classes = [];
    if (vtag) {
      const model = vtag.models.find(m => m.id === modelId);
      Array.prototype.push.apply(classes, model.classes);
      for (const cls of model.classes) {
        for (const brand of cls.brands) {
          for (const frame of brand.frames) {
            const start = (frame.position - 1) / vtag.video.fps;
            const unavailable = !Object.prototype.hasOwnProperty.call(frames, start);
            if (unavailable) {
              const end = ((frame.position - 1) / vtag.video.fps) + (1 / vtag.recognition.fps);
              frames[start] = {
                start,
                end,
                brands: [],
              };
            }
            frames[start].brands.push({
              id: brand.id,
              name: brand[key],
              rect: {
                left: frame.left,
                top: frame.top,
                width: frame.width,
                height: frame.height,
              },
            });
          }
        }
        Array.prototype.push.apply(brands, cls.brands);
      }
    }
    return video && vtag
      ? (
        <div styleName="container">
          <div styleName="header">
            <Header
              videos={videos}
              models={models}
              videoId={video.video_id}
              modelId={modelId}
              onBack={handleBack}
              onVideoSelect={handleVideoSelect}
              onModelSelect={handleModelSelect}
            />
          </div>
          <div styleName="body">
            <div styleName="left">
              <div styleName="player">
                <TagPlayer
                  ref={(node) => { this.player = node; }}
                  video={{
                    src: video.video_url,
                    width: vtag.video.width,
                    height: vtag.video.height,
                  }}
                  frames={Object.keys(frames).map(k => ({
                    start: frames[k].start,
                    end: frames[k].end,
                    brands: frames[k].brands,
                  }))}
                  time={time}
                />
              </div>
              <div styleName="chart">
                <TagChart brands={brands} locale={locale} />
              </div>
            </div>
            <div styleName="right">
              <div styleName="tags">
                <TagList
                  classes={classes}
                  fps={vtag.video.fps}
                  locale={locale}
                  onTimeSelect={handleTimeSelect}
                />
              </div>
            </div>
          </div>
        </div>
      )
      : <div styleName="container" />;
  }
}

ReportContainer.propTypes = propTypes;

export default connect(
  createStructuredSelector({
    locale: getLocale,
  })
)(CSSModules(ReportContainer, styles));
