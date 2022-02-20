import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import io from 'socket.io-client';

import { ApiUtil, cookieUtil } from 'utils';
import { Modal } from 'vidya/Dialogs';
import {
  prepareUploadWithRecognition,
  processSeriesCreation,
  processStatusList,
  receiveStatus,
  processRecognitionRetry,
} from '../../actions';
import { SeriesForm, StatusList } from '../../components';
import { NAME } from '../../constants';
import { getCountries, getModels, getSeries, getStatus, getCounts } from '../../selectors';

import styles from './styles.scss';

class StatusContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    t: PropTypes.func,
    countries: PropTypes.array,
    models: PropTypes.array,
    series: PropTypes.array,
    videos: PropTypes.arrayOf(
      PropTypes.shape({
        video_id: PropTypes.number.isRequired,
        video_name: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        jobs: PropTypes.arrayOf(
          PropTypes.shape({
            job_id: PropTypes.number.isRequired,
            job_status: PropTypes.number.isRequired,
            job_progress: PropTypes.number.isRequired,
            model_id: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    counts: PropTypes.array,
  };

  componentDidMount() {
    this.viewHrs = Boolean(cookieUtil.getViewHrs());

    const { dispatch } = this.props;
    let action = processStatusList(3, 15, true);
    dispatch(action);
    action = processStatusList(4, 15, true);
    dispatch(action);
    action = processStatusList(5, 15);
    dispatch(action);
    action = processStatusList(6, 15);
    dispatch(action);

    this.socketio = io.connect(`${process.env.SIO_HOST}/socketio/videos`, {
      transports: ['polling'],
    });
    this.socketio.on('connect', () => {
      this.socketio.emit('join', {
        access_token: ApiUtil.token,
      });
    });
    this.socketio.on('video_status_changed', (message) => {
      action = receiveStatus(message);
      this.props.dispatch(action);
    });
  }

  componentWillUnmount() {
    this.socketio.disconnect();
  }

  handleSeriesClick = () => {
    const { handleSeriesCancel, handleSeriesSubmit } = this;
    const { countries } = this.props;
    const form = (
      <SeriesForm
        countries={countries}
        onCancel={handleSeriesCancel}
        onSubmit={handleSeriesSubmit}
      />
    );
    this.form.switchContent(form);
    this.form.toShow();
  };

  handleSeriesCancel = () => {
    this.form.toHide();
  };

  handleSeriesSubmit = (name, alias, countryId, files, modelIds, faceModel) => {
    let action = processSeriesCreation(name, alias, countryId);
    const promise = this.props.dispatch(action);
    if (files) {
      promise.then((series) => {
        for (const file of files) {
          action = prepareUploadWithRecognition(file, series.series_id, modelIds, faceModel);
          this.props.dispatch(action);
        }
      });
    }
    this.form.toHide();
  };

  handleRetry = (videoId) => {
    const action = processRecognitionRetry(videoId);
    this.props.dispatch(action);
  };

  render() {
    const { handleSeriesClick, handleRetry } = this;
    const { models, series, videos, counts, t } = this.props;
    const completed = videos.filter(
      video => (this.viewHrs ? video.status === 5 : video.status === 5 && video.hrs_status === 3));
    const pending = videos.filter(video => (this.viewHrs
      ? video.status === 3 || video.status === 4
      : (video.status === 3 || video.status === 4) || video.hrs_status !== 3));
    const failed = videos.filter(video => video.status === 6);
    const completedCount = counts.filter(count => count.status === 5)
      .map(count => count.count)
      .reduce((a, b) => a + b, 0);
    const pendingCount = counts.filter(count => count.status === 3 || count.status === 4)
      .map(count => count.count)
      .reduce((a, b) => a + b, 0);
    const failedCount = counts.filter(count => count.status === 6)
      .map(count => count.count)
      .reduce((a, b) => a + b, 0);
    return (
      // why hide statusList when viewHrs === 0
      // `count` is computed in backend
      // difficult to know user's current role
      this.viewHrs ?
        <div>
          <div styleName="header">
            <h2>{t('statusReport')}</h2>
          </div>
          <div styleName="content">
            <StatusList
              models={models}
              series={series}
              completed={completed}
              pending={pending}
              failed={failed}
              completedCount={completedCount}
              pendingCount={pendingCount}
              failedCount={failedCount}
              onSeriesClick={handleSeriesClick}
              onRetry={handleRetry}
            />
          </div>
          <Modal headerHide hideWhenBackground ref={(node) => { this.form = node; }} />
        </div>
      : null
    );
  }
}

export default translate([NAME])(connect(
  createStructuredSelector({
    countries: getCountries,
    models: getModels,
    series: getSeries,
    videos: getStatus,
    counts: getCounts,
  })
)(CSSModules(StatusContainer, styles)));
