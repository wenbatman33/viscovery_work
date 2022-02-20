import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import humanize from 'humanize';

import { cookieUtil } from 'utils';
import JobStatusIcon from '../JobStatusIcon';
import { between } from '../../../utils/mathUtil';
import { JOB_UNDEFINED_ERROR_CODE, NAME } from '../../constants';

import styles from './styles.scss';

const TRIGGER_TIMEOUT = 12 * 1000;
const ENQUEUE_TIMEOUT = 120 * 1000;
const RECOGNITION_TIMEOUT = 60 * 1000;

class Row extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    models: PropTypes.arrayOf(
      PropTypes.shape({
        model_id: PropTypes.number.isRequired,
        model_name: PropTypes.string.isRequired,
      })
    ).isRequired,
    video: PropTypes.shape({
      video_id: PropTypes.number.isRequired,
      video_name: PropTypes.string.isRequired,
      jobs: PropTypes.arrayOf(
        PropTypes.shape({
          model_id: PropTypes.number.isRequired,
          job_status: PropTypes.number.isRequired,
          job_progress: PropTypes.number.isRequired,
          update_time: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    onRetry: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      viewHrs: Boolean(cookieUtil.getViewHrs()),
    };
  }

  getStatusText = (job) => {
    const offset = new Date() - new Date(job.update_time);
    let iconStatus;
    switch (job.job_status) {
      case 0: {
        if (offset >= TRIGGER_TIMEOUT) {
          iconStatus = 'fail';
        }
        iconStatus = 'waiting';
        break;
      }
      case 1: {
        if (offset >= ENQUEUE_TIMEOUT) {
          if (job.predict_end_time) {
            const timeout = new Date() > new Date(job.predict_end_time);
            if (!timeout) {
              iconStatus = 'waiting';
            }
          }
          iconStatus = 'fail';
        }
        iconStatus = 'waiting';
        break;
      }
      case 2:
        if (offset >= RECOGNITION_TIMEOUT) {
          if (job.predict_end_time) {
            const timeout = new Date() > new Date(job.predict_end_time);
            if (!timeout) {
              iconStatus = 'processing';
            }
          }
          iconStatus = 'fail';
        }
        iconStatus = 'processing';
        break;
      case 3:
        iconStatus = 'success';
        break;
      default:
        break;
    }
    if (iconStatus === 'success' && !this.state.viewHrs) {
      iconStatus = Boolean(job.hrs_finish) && iconStatus ? iconStatus : 'processing';
    }

    // handle iconStatus error
    if (!iconStatus) {
      iconStatus = 'fail';
    }

    return iconStatus;
  };

  getMessage = (job) => {
    const { t } = this.props;
    const offset = new Date() - new Date(job.update_time);
    switch (job.job_status) {
      case 0: {
        if (offset >= TRIGGER_TIMEOUT) {
          return t('analysisTimeout');
        }
        return null;
      }
      case 1: {
        if (offset >= ENQUEUE_TIMEOUT) {
          if (job.predict_end_time) {
            const timeout = new Date() > new Date(job.predict_end_time);
            if (!timeout) {
              return null;
            }
          }
          return t('analysisTimeout');
        }
        return null;
      }
      case 2: {
        if (offset >= RECOGNITION_TIMEOUT) {
          if (job.predict_end_time) {
            const timeout = new Date() > new Date(job.predict_end_time);
            if (!timeout) {
              return null;
            }
          }
          return t('analysisTimeout');
        }
        return null;
      }
      case 3: {
        return null;
      }
      default: {
        const errorCode = job.errorcode;
        let message = `${t('analysisFailed')} (${!errorCode ? JOB_UNDEFINED_ERROR_CODE : errorCode})`;
        if (errorCode && between(errorCode, -1000, -3000)) {
          message = `${t('unsupportedFormat')} (${errorCode})`;
        }
        return message;
      }
    }
  };

  getModelText = modelId => (
    this.props.models.find(model => model.model_id === modelId).model_name.toUpperCase()[0]
  );

  handleRetry = (videoId) => {
    const { onRetry } = this.props;
    if (onRetry) {
      onRetry(videoId);
    }
  };

  render() {
    const { handleRetry } = this;
    const { video, onRetry, t } = this.props;
    return (
      <div styleName="row">
        <div styleName="name" title={video.video_name}>{video.video_name}</div>
        <div styleName="job">
          {video.jobs.map((job, index) => (
            <div key={index}>
              <JobStatusIcon
                status={this.getStatusText(job)}
                model={this.getModelText(job.model_id)}
                progress={job.job_progress}
                message={this.getMessage(job)}
              />
            </div>
          ))}
        </div>
        <div styleName="timestamp">
          {video.timestamp
            ? humanize.date('Y-m-d H:i', video.timestamp)
            : '預估中…'
          }
        </div>
        {onRetry
          ? (
            <div styleName="action">
              <a onClick={handleRetry}>{t('retryAnalysis')}</a>
            </div>
          )
          : null
        }
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(Row, styles));
