import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { ApiUtil, LogUtil, cookieUtil, routerUtil } from 'utils';
import { Button } from 'vidya/Button';
import DonutChart from './DonutChart';
import TopTagsTable from './TopTagsTable';
import TabGroup from './TabGroup';
import * as util from './util';
import { DONUT_COLORS as colors, NAME } from '../../constants';

import styles from './styles.scss';


const filterReports = report =>
  Boolean(cookieUtil.getViewHrs()) || report.hrs_finish;


class RecognitionReport extends React.Component {
  state = {
    selectedModel: -1,
    reports: null,
    loading: true,
    failed: false,
  };

  componentWillMount() {
    if (this.state.reports && !this.state.loading) {
      this.setState({
        loading: true,
        failed: false,
      });
    }
  }

  componentDidMount() {
    this.queryReport();
  }

  handleChange = (modelId) => {
    if (modelId < 0) {
      routerUtil.pushHistory(`/${NAME}/report/${this.props.videoId}`);
    } else {
      this.setState({
        selectedModel: modelId,
      });
    }
  };

  queryReport = () => {
    ApiUtil.get(`/api/reports?video_id=${this.props.videoId}`)
      .then((response) => {
        let { reports } = response;
        reports = reports.filter(filterReports);
        this.setState({
          loading: false,
          failed: false,
          reports,
          selectedModel: reports.length > 0 ? reports[0].model_id : -1,
        });
      })
      .catch((ex) => {
        LogUtil.debug(`Request report failed, ${ex.message || ''}, video id = ${this.props.videoId}`);
        this.setState({
          loading: false,
          failed: true,
        });
      });
  };

  renderReport = () => {
    const { locale, t } = this.props;
    const { reports } = this.state;

    const tabs = util.extractTabGroupData(reports, t);
    const report = reports
      ? reports.find(r => r.model_id === this.state.selectedModel)
      : {};
    const tableData = util.reportToTableData(report, locale);
    return (
      <div styleName="report-container">
        <TabGroup
          tabs={tabs}
          selected={this.state.selectedModel}
          onChange={this.handleChange}
        />
        <TopTagsTable data={tableData} colors={colors} />
        <DonutChart data={tableData} />
      </div>
    );
  };

  renderLoading = () => {
    const { t } = this.props;
    return (
      <div styleName="report-container">
        {t('requestPending')}
      </div>
    );
  };

  renderFailed = () => {
    const { t } = this.props;
    return (
      <div styleName="report-container">
        <div>
          {t('requestFailed')}
          <Button vdStyle={'link'} onClick={this.queryReport}>{t('retryRequest')}</Button>
        </div>
      </div>
    );
  };

  render() {
    const { loading, reports } = this.state;

    if (reports) {
      return this.renderReport();
    } else if (loading) {
      return this.renderLoading();
    }
    return this.renderFailed();
  }
}

RecognitionReport.defaultProps = {
  // reports : [] ,
};
RecognitionReport.propTypes = {
  t: PropTypes.func.isRequired,
  videoId: PropTypes.number.isRequired,
  locale: PropTypes.string,
};

export default translate([NAME])(CSSModules(RecognitionReport, styles));
