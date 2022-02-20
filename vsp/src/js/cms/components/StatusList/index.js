import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Interpolate, translate } from 'react-i18next';

import { HorizontalDivider } from 'vidya';
import EmptyPanel from './EmptyPanel';
import SeriesPanel from './SeriesPanel';
import Row from './Row';
import HeaderRow from './HeaderRow';
import { NAME } from '../../constants';

import styles from './styles.scss';

const LIST_LIMIT = 15;

const CountComponent = CSSModules(({ count }) => (
  <span styleName="length">{count}</span>
), styles);

class StatusList extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    models: PropTypes.arrayOf(
      PropTypes.shape({
        model_id: PropTypes.number.isRequired,
        model_name: PropTypes.string.isRequired,
      })
    ).isRequired,
    series: PropTypes.arrayOf(
      PropTypes.shape({
        summary: PropTypes.shape({
          total: PropTypes.number.isRequired,
        }),
      })
    ).isRequired,
    completed: PropTypes.arrayOf(
      PropTypes.shape({
        video_id: PropTypes.number.isRequired,
        video_name: PropTypes.string.isRequired,
        jobs: PropTypes.arrayOf(
          PropTypes.shape({
            model_id: PropTypes.number.isRequired,
            job_status: PropTypes.number.isRequired,
            job_progress: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    pending: PropTypes.arrayOf(
      PropTypes.shape({
        video_id: PropTypes.number.isRequired,
        video_name: PropTypes.string.isRequired,
        jobs: PropTypes.arrayOf(
          PropTypes.shape({
            model_id: PropTypes.number.isRequired,
            job_status: PropTypes.number.isRequired,
            job_progress: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    failed: PropTypes.arrayOf(
      PropTypes.shape({
        video_id: PropTypes.number.isRequired,
        video_name: PropTypes.string.isRequired,
        jobs: PropTypes.arrayOf(
          PropTypes.shape({
            model_id: PropTypes.number.isRequired,
            job_status: PropTypes.number.isRequired,
            job_progress: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    completedCount: PropTypes.number,
    pendingCount: PropTypes.number,
    failedCount: PropTypes.number,
    onSeriesClick: PropTypes.func,
    onRetry: PropTypes.func,
  };

  handleSeriesClick = () => {
    const { onSeriesClick } = this.props;
    if (onSeriesClick) {
      onSeriesClick();
    }
  };

  handleRetry = (videoId) => {
    const { onRetry } = this.props;
    if (onRetry) {
      onRetry(videoId);
    }
  };

  render() {
    const { handleSeriesClick, handleRetry } = this;
    const { series, completedCount, pendingCount, failedCount } = this.props;
    const empty = series.every(s => !s.summary.total);
    if (empty) {
      return <SeriesPanel onClick={handleSeriesClick} />;
    }

    let compare = (a, b) => {
      if (a.timestamp < b.timestamp) {
        return 1;
      }
      if (a.timestamp > b.timestamp) {
        return -1;
      }
      return 0;
    };
    const completed = this.props.completed.slice();
    completed.sort(compare);
    completed.splice(LIST_LIMIT);
    const failed = this.props.failed.slice();
    failed.sort(compare);
    compare = (a, b) => {
      if (a.timestamp < b.timestamp) {
        return -1;
      }
      if (a.timestamp > b.timestamp) {
        return 1;
      }
      return 0;
    };
    const pending = this.props.pending.slice();
    pending.sort(compare);
    pending.splice(LIST_LIMIT);
    const inactive = !(completed.length || pending.length || failed.length);
    if (inactive) {
      return <EmptyPanel />;
    }

    const completedTotal = <CountComponent count={completedCount} />;
    const completedShown = <CountComponent count={completed.length} />;
    const pendingTotal = <CountComponent count={pendingCount} />;
    const pendingShown = <CountComponent count={pending.length} />;
    const failedTotal = <CountComponent count={failedCount} />;
    const failedShown = <CountComponent count={failed.length} />;
    return (
      <div>
        <div styleName="list">
          <div styleName="header">
            <h2>
              <Interpolate i18nKey="completedAnalysisSummary" total={completedTotal} shown={completedShown} />
            </h2>
          </div>
          <HorizontalDivider />
          <HeaderRow />
          <div styleName="content">
            {completed.map(video => (
              <Row key={video.video_id} models={this.props.models} video={video} />
            ))
            }
          </div>
        </div>
        <div styleName="list">
          <div styleName="header">
            <h2>
              <Interpolate i18nKey="pendingAnalysisSummary" total={pendingTotal} shown={pendingShown} />
            </h2>
          </div>
          <HorizontalDivider />
          <HeaderRow />
          <div styleName="content">
            {pending.map(video => (
              <Row key={video.video_id} models={this.props.models} video={video} />
            ))
            }
          </div>
        </div>
        <div styleName="list">
          <div styleName="header">
            <h2>
              <Interpolate i18nKey="failedAnalysisSummary" total={failedTotal} shown={failedShown} />
            </h2>
          </div>
          <HorizontalDivider />
          <HeaderRow onRetry={handleRetry} />
          <div styleName="content">
            {failed.map(video => (
              <Row
                key={video.video_id}
                models={this.props.models}
                video={video}
                onRetry={() => handleRetry(video.video_id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(StatusList, styles));
