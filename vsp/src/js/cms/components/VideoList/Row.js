import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { ContextMenuProvider } from 'react-contexify';
import { translate } from 'react-i18next';

import { cookieUtil } from 'utils';
import { Button } from 'vidya/Button';
import JobStatusIcon from '../../components/JobStatusIcon';
import RecognitionReport from '../RecognitionReport';
import { between } from '../../../utils/mathUtil';
import { JOB_UNDEFINED_ERROR_CODE, NAME } from '../../constants';

import styles from './styles.scss';

import placeholder from '../../assets/placeholder.png';

const TRIGGER_TIMEOUT = 240 * 1000;
const ENQUEUE_TIMEOUT = 240 * 1000;
const RECOGNITION_TIMEOUT = 240 * 1000;

class Row extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    checked: PropTypes.bool,
    video: PropTypes.shape({
      video_id: PropTypes.number.isRequired,
      video_name: PropTypes.string.isRequired,
      status: PropTypes.number.isRequired,
      jobs: PropTypes.arrayOf(
        PropTypes.shape({
          job_status: PropTypes.number.isRequired,
          model_id: PropTypes.number.isRequired,
          update_time: PropTypes.string,
          predict_end_time: PropTypes.string,
        })
      ).isRequired,
      hrs_status: PropTypes.number,
    }).isRequired,
    upload: PropTypes.shape({
      status: PropTypes.number.isRequired,
      progress: PropTypes.number.isRequired,
    }),
    models: PropTypes.arrayOf(
      PropTypes.shape({
        model_id: PropTypes.number,
        model_name: PropTypes.string,
      })
    ).isRequired,
    actionsVisible: PropTypes.bool.isRequired,
    locale: PropTypes.string,
    onChange: PropTypes.func,
    onRecogBtnClick: PropTypes.func.isRequired,
    onEditButtonClick: PropTypes.func.isRequired,
  };

  state = {
    checked: this.props.checked,
    showReport: false,
    viewHrs: Boolean(cookieUtil.getViewHrs()),
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: nextProps.checked,
    });
  }

  getReportStatus= (video) => {
    const { t } = this.props;
    const { showReport } = this.state;
    switch (video.status) {
      case 3:
      case 4:
      case 5:
      case 6: {
        return video.jobs.some(job => (
          this.state.viewHrs ? job.job_status === 3 : job.job_status === 3 && job.hrs_finish === 1
        ))
          ? (
            <div styleName="view-report" onClick={() => this.setState({ showReport: !showReport })}>
              {showReport ? t('hideReport') : t('showReport')}
            </div>
          )
          : t('noReport');
      }
      case 1:
      case 2:
      case 7:
      default: {
        return t('noReport');
      }
    }
  };

  getStatusText = (video, upload) => {
    const { t } = this.props;
    const icons = [];
    switch (video.status) {
      case 1:
        if (upload) {
          switch (upload.status) {
            case 1:
              return `${t('uploading')} (${Math.floor(upload.progress)}%)`;
            case 2:
              return t('uploadCompleted');
            case 3:
            case 4:
              return t('uploadFailed');
            case 0:
            default:
              return t('uploadPending');
          }
        } else {
          return t('fileUnavailable');
        }
      case 2:
        return t('uploadCompleted');
      case 7:
        return t('converting');
      case 3:
      case 4:
      case 5:
      case 6:
      default:
        video.jobs.forEach((job) => {
          const model = this.props.models.find(m => m.model_id === job.model_id);
          const iconText = model.model_name.toUpperCase()[0];
          let iconStatus;
          let message = null;
          switch (job.job_status) {
            case 0: {
              const offset = new Date() - new Date(job.update_time);
              if (offset >= TRIGGER_TIMEOUT) {
                iconStatus = 'fail';
                message = t('analysisTimeout');
              } else {
                iconStatus = 'waiting';
                message = t('analysisPending');
              }
              break;
            }
            case 1: {
              iconStatus = 'waiting';
              if (job.predict_end_time) {
                message = t('analysisPending');
              } else {
                message = t('analysisPending');
              }
              const offset = new Date() - new Date(job.update_time);
              if (offset >= ENQUEUE_TIMEOUT) {
                if (job.predict_end_time) {
                  const timeout = new Date() > new Date(job.predict_end_time);
                  if (!timeout) {
                    break;
                  }
                }
                iconStatus = 'fail';
                message = t('analysisTimeout');
              }
              break;
            }
            case 2: {
              iconStatus = 'processing';
              if (job.predict_end_time) {
                message = t('analyzing');
              } else {
                message = t('analyzing');
              }
              const offset = new Date() - new Date(job.update_time);
              if (offset >= RECOGNITION_TIMEOUT) {
                if (job.predict_end_time) {
                  const timeout = new Date() > new Date(job.predict_end_time);
                  if (!timeout) {
                    break;
                  }
                }
                iconStatus = 'fail';
                message = t('analysisTimeout');
              }
              break;
            }
            case 3: {
              iconStatus = 'success';
              break;
            }
            case 4:
            default: {
              const errorCode = job.errorcode;
              iconStatus = 'fail';
              message = `${t('analysisFailed')} (${!errorCode ? JOB_UNDEFINED_ERROR_CODE : errorCode})`;
              if (errorCode && between(errorCode, -1000, -3000)) {
                message = `${t('unsupportedFormat')} (${errorCode})`;
              }
              break;
            }
          }

          if (iconStatus === 'success' && !this.state.viewHrs && video.hrs_status > 0) {
            iconStatus = Boolean(job.hrs_finish) && iconStatus ? iconStatus : 'processing';
            message = t('analyzing');
          }

          icons.push(
            <JobStatusIcon
              key={job.model_id}
              status={iconStatus}
              model={iconText}
              progress={job.job_progress}
              message={message}
            />
          );
        });
        return <StatusIconBox icons={icons} />;
    }
  };

  handleChange = (event) => {
    this.setState({
      checked: event.target.checked,
    });

    const { onChange } = this.props;
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  isRecognitionReady = (video) => {
    switch (video.status) {
      case 2: {
        return true;
      }
      case 7: {
        return false;
      }
      case 3:
      case 4:
      case 5:
      case 6:
      default: {
        const finished = video.jobs.every(job => job.job_status > 2);
        if (finished) {
          return true;
        }

        const date = new Date();
        for (const job of video.jobs) {
          const offset = date - new Date(job.update_time);
          switch (job.job_status) {
            case 0: {
              if (offset < TRIGGER_TIMEOUT) {
                return false;
              }
              break;
            }
            case 1: {
              if (offset < ENQUEUE_TIMEOUT) {
                return false;
              }
              if (job.predict_end_time) {
                const processing = new Date() <= new Date(job.predict_end_time);
                if (processing) {
                  return false;
                }
              }
              break;
            }
            case 2: {
              if (offset < RECOGNITION_TIMEOUT) {
                return false;
              }
              if (job.predict_end_time) {
                const processing = new Date() <= new Date(job.predict_end_time);
                if (processing) {
                  return false;
                }
              }
              break;
            }
            default: {
              break;
            }
          }
        }
        return true;
      }
    }
  };

  render() {
    const { video, upload, actionsVisible, locale, t } = this.props;
    const { checked } = this.state;

    return (
      <div>
        <div styleName="row">
          <div styleName="checkbox">
            <input type="checkbox" checked={checked} onChange={this.handleChange} />
          </div>
          <div styleName="thumbnail">
            <img alt="thumbnail" src={placeholder} />
          </div>
          <div styleName="name" title={video.video_name}>{video.video_name}</div>
          <div styleName="status">
            <div styleName="icons">
              {this.getStatusText(video, upload)}
            </div>
            {video.hrs_status === 3 && this.state.viewHrs
              ? <div styleName="hrs">(HRS)</div>
              : null
            }
          </div>
          <div styleName="report">{this.getReportStatus(video)}</div>
          <div styleName="uploader">{video.uploader.username}</div>
          <div styleName="action">
            {actionsVisible && video.status > 1
              ? (
                <Button
                  vdSize="function"
                  vdStyle="secondary"
                  disable={(this.state.viewHrs
                    ? !this.isRecognitionReady(video)
                    : (!this.isRecognitionReady(video) || [1, 2].includes(video.hrs_status))
                  )}
                  onClick={() => this.props.onRecogBtnClick(video.video_id)}
                >
                  {t('analyzeVideo')}
                </Button>
              )
              : null
            }
            {upload && upload.status < 2
              ? null
              : (
                <ContextMenuProvider id="video" event="onClick">
                  <Button vdSize="function" vdStyle="secondary">
                    <i className="fa fa-cog" data-id={video.video_id} />
                  </Button>
                </ContextMenuProvider>
              )
            }
          </div>
        </div>
        {this.state.showReport
          ? <RecognitionReport key={video.video_id} videoId={video.video_id} locale={locale} />
          : null
        }
      </div>
    );
  }
}

const StatusIconBox = ({ icons }) => (
  <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
    {icons}
  </div>
);

StatusIconBox.propTypes = {
  icons: PropTypes.arrayOf(PropTypes.element),
};


export default translate([NAME])(CSSModules(Row, styles));
