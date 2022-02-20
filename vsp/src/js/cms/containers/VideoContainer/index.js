import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import io from 'socket.io-client';

import { Button } from 'vidya/Button';
import { Modal } from 'vidya/Dialogs';
import {
  prepareUploadWithRecognition,
  processVideoList,
  processVideoUpdate,
  processVideoRemoval,
  processRecognition,
  receiveVideo,
} from '../../actions';
import { UploadSettingsForm, VideoInfoForm, VideoList, VideoRemoveForm } from '../../components';
import { NAME } from '../../constants';
import { getSeries, getVideos, getUploads, getModels } from '../../selectors';
import { getLocale } from '../../../app/selectors';
import { ApiUtil, routerUtil } from '../../../utils';

import { getUploadEnabled } from '../../../auth/selectors';
import hrs from '../../../hrs';

import RecogSettingSideBar from '../../components/RecogSettingSideBar';
import MoveVideoForm from '../../components/MoveVideoForm';

import styles from './styles.scss';

const TIMEOUT = 2 * 60 * 1000;

const propTypes = {
  locale: PropTypes.string,
  dispatch: PropTypes.func,
  t: PropTypes.func,
  series: PropTypes.array,
  videos: PropTypes.array,
  models: PropTypes.array,
  uploads: PropTypes.array,
  uploadEnabled: PropTypes.number,
  match: PropTypes.object,
};

class VideoContainer extends React.Component {
  state = {
    series: this.props.series.find(
      series => series.series_id === parseInt(this.props.match.params.series_id, 10)
    ),
    videos: this.props.videos.filter(
      video => video.series_id === parseInt(this.props.match.params.series_id, 10)
    ),
    checkedIds: [],
    recognitionVideos: [],
  };

  componentDidMount() {
    if (this.state.series) {
      this.handleRefresh(this.state.series);
      this.scheduleRefresh(this.state.series);
    }

    this.socketio = io.connect(`${process.env.SIO_HOST}/socketio/videos`, {
      transports: ['polling'],
    });
    this.socketio.on('connect', () => {
      this.socketio.emit('join', {
        access_token: ApiUtil.token,
      });
    });
    this.socketio.on('video_status_changed', (message) => {
      const action = receiveVideo(message);
      this.props.dispatch(action);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.series_id !== this.props.match.params.series_id
      || !this.state.series) {
      const series = nextProps.series.find(
        s => s.series_id === parseInt(nextProps.match.params.series_id, 10)
      );
      if (series) {
        this.unscheduleRefresh();
        this.handleRefresh(series);
        this.scheduleRefresh(series);
      }

      this.setState({ receiveVideo: -1 });
    }

    this.setState({
      series: nextProps.series.find(
        series => series.series_id === parseInt(nextProps.match.params.series_id, 10)
      ),
      videos: nextProps.videos.filter(
        video => video.series_id === parseInt(nextProps.match.params.series_id, 10)
      ),
    });
  }

  componentWillUnmount() {
    this.unscheduleRefresh();
    this.socketio.disconnect();
  }

  scheduler = null;

  handleRefresh = (series) => {
    const action = processVideoList(series);
    this.props.dispatch(action);
  };

  scheduleRefresh = (series) => {
    this.scheduler = setTimeout(() => {
      this.handleRefresh(series);
      this.scheduleRefresh(series);
    }, TIMEOUT);
  };

  unscheduleRefresh = () => {
    if (this.scheduler) {
      clearTimeout(this.scheduler);
    }
  };

  handleChange = (checkedIds) => {
    this.setState({
      checkedIds,
    });
  };

  handleUpload = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.upload.click();
  };

  handleFile = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const { handleFileCancel, handleFileSubmit } = this;
    const files = [];
    for (const file of event.target.files) {
      files.push(file);
    }
    const form = (
      <UploadSettingsForm files={files} onCancel={handleFileCancel} onSubmit={handleFileSubmit} />);
    this.form.switchContent(form);
    this.form.toShow();
    /* eslint-disable no-param-reassign */
    event.target.value = null;
    /* eslint-enable */
  };

  handleFileCancel = () => {
    this.form.toHide();
  };

  handleFileSubmit = (files, modelIds, faceModel) => {
    for (const file of files) {
      const action = prepareUploadWithRecognition(
        file, this.state.series.series_id, modelIds, faceModel);
      this.props.dispatch(action);
    }
    this.form.toHide();
  };

  handleUpdate = (id) => {
    const video = this.props.videos.find(v => v.video_id === id);
    if (video) {
      const form = (
        <VideoInfoForm
          id={video.video_id}
          name={video.video_name}
          sourceVideoId={video.source_video_id === null ? '' : video.source_video_id}
          sourceVideoUrl={video.source_url === null ? '' : video.source_url}
          onCancel={this.handleUpdateCancel}
          onSubmit={(name, sourceVideoId, sourceVideoUrl) =>
            this.handleUpdateSubmit(id, name, sourceVideoId, sourceVideoUrl)
          }
        />
      );
      this.form.switchContent(form);
      this.form.toShow();
    }
  };

  handleUpdateCancel = () => {
    this.form.toHide();
  };

  handleUpdateSubmit = (id, name, sourceVideoId, sourceVideoUrl) => {
    const video = this.props.videos.find(v => v.video_id === id);
    if (video) {
      const action =
        processVideoUpdate(video, name, video.series_id, null, sourceVideoId, sourceVideoUrl);
      this.props.dispatch(action);
    }
    this.form.toHide();
  };

  handleDelete = (ids) => {
    const videos = this.props.videos.filter(
      video => ids.findIndex(id => id === video.video_id) !== -1);
    const form = (
      <VideoRemoveForm
        videos={videos}
        onCancel={() => this.form.toHide()}
        onRemove={() => this.doVideosDelete(videos)}
      />
    );
    this.form.switchContent(form);
    this.form.toShow();
  };

  doVideosDelete = (videos) => {
    this.form.toHide();
    for (const video of videos) {
      const action = processVideoRemoval(video);
      this.props.dispatch(action);
    }
  };

  handleRecogBtnClick = (ids) => {
    this.setState({
      recognitionVideos: ids,
    });
  };

  handleEditButtonClick = (videoId) => {
    routerUtil.pushHistory(`/${hrs.constants.NAME}/video/${videoId}`);
  };

  handleRecogSettingSubmit = (result) => {
    const modelIDs = [];
    this.props.models.forEach((model) => {
      if (Object.prototype.hasOwnProperty.call(result, model.model_name)
        && result[model.model_name]) {
        modelIDs.push(model.model_id);
      }
    });
    if (modelIDs.length > 0) {
      for (const id of result.videoIds) {
        const action = processRecognition(id, modelIDs.join(), result.faceModel);
        this.props.dispatch(action);
      }
    }
    this.setState({
      checkedIds: [],
      recognitionVideos: [],
    });
  };

  handleMove = (ids) => {
    const form = (
      <MoveVideoForm
        series={this.props.series}
        onCancel={() => this.form.toHide()}
        onSubmit={(targetSeries) => { this.handleMoveSubmit(targetSeries, ids); }}
      />
    );
    this.form.switchContent(form);
    this.form.toShow();
  };

  handleMoveSubmit = (targetSeries, ids) => {
    const videos = this.props.videos.filter(video => ids.find(id => id === video.video_id));
    for (const video of videos) {
      const action = processVideoUpdate(video, video.video_name, targetSeries.series_id);
      this.props.dispatch(action);
    }
    this.form.toHide();
  };

  render() {
    const { uploadEnabled, locale, t } = this.props;
    const { series, videos, checkedIds } = this.state;
    let actions = null;
    if (checkedIds.length) {
      actions = (
        <div styleName="actions">
          <Button
            vdSize="normal"
            vdStyle="secondary"
            onClick={() => this.handleMove(checkedIds)}
          >
            {t('moveVideo')}
          </Button>
          <Button
            vdSize="normal"
            vdStyle="secondary"
            onClick={() => this.handleDelete(checkedIds)}
          >
            {t('deleteVideo')}
          </Button>
          {uploadEnabled
            ? (
              <Button
                vdSize="normal"
                vdStyle="secondary"
                onClick={() => this.handleRecogBtnClick(checkedIds)}
              >
                {t('analyzeVideo')}
              </Button>
            )
            : null
          }
        </div>
      );
    } else if (uploadEnabled) {
      actions = (
        <div styleName="actions">
          <Button vdSize="normal" vdStyle="secondary" onClick={this.handleUpload}>
            {t('uploadVideo')}
          </Button>
          <input
            multiple
            type="file"
            accept="video/mp4,video/quicktime"
            ref={(node) => { this.upload = node; }}
            onChange={this.handleFile}
          />
        </div>
      );
    }
    return series
      ? (
        <div styleName="container">
          <div styleName="header">
            <h2 styleName="title">{series.series_name}</h2>
            {actions}
          </div>
          <div styleName="content">
            <div styleName="list">
              <VideoList
                videos={videos}
                checkedIds={checkedIds}
                models={this.props.models}
                uploads={this.props.uploads}
                actionsVisible={!!uploadEnabled}
                locale={locale}
                onChange={this.handleChange}
                onUpdate={this.handleUpdate}
                onDelete={id => this.handleDelete([id])}
                onRecogBtnClick={id => this.handleRecogBtnClick([id])}
                onEditButtonClick={this.handleEditButtonClick}
                onMove={id => this.handleMove([id])}
              />
            </div>
          </div>
          <RecogSettingSideBar
            hide={!this.state.recognitionVideos.length}
            onCancel={() => this.setState({ recognitionVideos: [] })}
            onSubmit={this.handleRecogSettingSubmit}
            videoIds={this.state.recognitionVideos}
          />
          <Modal headerHide hideWhenBackground ref={(node) => { this.form = node; }} />
        </div>
      )
      : <div />;
  }
}

VideoContainer.propTypes = propTypes;

export default translate([NAME])(connect(
  createStructuredSelector({
    uploadEnabled: getUploadEnabled,
    series: getSeries,
    videos: getVideos,
    uploads: getUploads,
    models: getModels,
    locale: getLocale,
  })
)(CSSModules(VideoContainer, styles)));
