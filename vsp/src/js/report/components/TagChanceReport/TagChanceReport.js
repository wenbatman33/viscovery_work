import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'vidya/Button';
import CSSModules from 'react-css-modules';
import { ApiUtil, LogUtil } from 'utils';
import moment from 'moment';

import IntervalPicker from './IntervalPicker';
import styles from './TagChanceReport.scss';

import * as helper from './helper';
import { downloadHook, addHostPrefix } from '../../utils';

const OPTION_VALUES = {
  ANY: 'any',
  INTERVAL: 'interval',
};

class TagChanceReport extends React.PureComponent {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.options = [
      {
        label: `${t('any')}`,
        value: OPTION_VALUES.ANY,
      },
      {
        label: `${t('specificInterval')}`,
        value: OPTION_VALUES.INTERVAL,
      },
    ];

    this.state = {
      startDate: moment(),
      endDate: moment(),
      intervalOption: this.options[0].value,
    };
  }

  options = [];

  handleIntervalOptionChange = (nextValue) => {
    if (nextValue) {
      this.setState({
        intervalOption: nextValue,
      });
    }
  };

  handleStartTimeChange = (date) => {
    if (date) {
      this.setState({
        startDate: date,
      });
    }
  };

  handleEndTimeChange = (date) => {
    if (date) {
      this.setState({
        endDate: date,
      });
    }
  } ;

  downloadReport = () => {
    const { startDate, endDate, intervalOption } = this.state;
    const start = helper.dateToString(startDate);
    const end = helper.dateToString(endDate);

    this.props.showLoading();

    if (intervalOption === OPTION_VALUES.ANY) {
      ApiUtil.get('/api/reports/summary')
        .then(this._downloadSuccessHandler)
        .catch(this._downloadFailHandler);
    }

    if (intervalOption === OPTION_VALUES.INTERVAL) {
      ApiUtil.get(`/api/reports/summary?start_time=${start}&end_time=${end}`)
        .then(this._downloadSuccessHandler)
        .catch(this._downloadFailHandler);
    }
  };

  _downloadSuccessHandler = (res) => {
    this.props.hideLoading();
    if (res.status === 204) {
      alert(`${this.props.t('emptyResult')}`);
      return;
    }
    const url = addHostPrefix(res.download_url);
    const fileName = res.download_url.split('/').pop();
    downloadHook(url, fileName);
  };

  _downloadFailHandler = (ex) => {
    this.props.hideLoading();
    alert(`Download failed. (${(ex && ex.response && ex.response.status) || (ex && ex.message)})`);
    LogUtil.debug(`Download report failed, ex=${ex}, status= ${ex && ex.response && ex.response.status}`);
  };

  render() {
    const { t, group } = this.props;
    return (
      <div styleName="root">
        <h2>{t('title')}</h2>
        <div styleName="ta-container">
          <span styleName="group">{t('targetGroup')}</span> {group && (group.name || '')}
        </div>
        <div styleName="interval-container">
          <div styleName="title-interval">{t('statisticalInterval')}</div>
          <div>
            <div styleName="interval-any">
              <input
                type="radio"
                value={OPTION_VALUES.ANY}
                checked={this.state.intervalOption === OPTION_VALUES.ANY}
                onChange={() => {
                  this.handleIntervalOptionChange(OPTION_VALUES.ANY);
                }}
              />
              {t('any')}
            </div>
            <div styleName="interval-specific">
              <input
                type="radio"
                value={OPTION_VALUES.INTERVAL}
                checked={this.state.intervalOption === OPTION_VALUES.INTERVAL}
                onChange={() => {
                  this.handleIntervalOptionChange(OPTION_VALUES.INTERVAL);
                }}
              />
              {t('specificInterval')}
              <div
                style={
                  this.state.intervalOption === OPTION_VALUES.INTERVAL ?
                    { visibility: 'visible' } :
                    { visibility: 'hidden' }
                }
              >
                <IntervalPicker
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onStartChange={this.handleStartTimeChange}
                  onEndChange={this.handleEndTimeChange}
                  locale={this.props.locale}
                />
              </div>
            </div>

          </div>
        </div>
        <Button
          vdStyle={'secondary'}
          onClick={this.downloadReport}
        >
          {t('exportReport')}
        </Button>
      </div>
    );
  }
}

TagChanceReport.propTypes = {
  t: PropTypes.func,
  locale: PropTypes.string.isRequired,
  group: PropTypes.object,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
};


export default CSSModules(TagChanceReport, styles);
