import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import moment from 'moment';
import humanize from 'humanize';

import styles from './MultiDayPerformance.scss';
import SingleLineChart from '../../common/SingleLineChart';

const countSum = R.compose(
  R.sum,
  R.map(ele => ele.count),
);

const handleTimeRange = (range) => {
  const since = moment(range[0], 'YYYYMMDD');
  const to = moment(range[1], 'YYYYMMDD');
  const diff = to.diff(since, 'days');
  const dateRange = [];
  let i = 0;
  for (i = 0; i <= diff; i += 1) {
    dateRange.push(since.clone().add(i, 'd').format('YYYYMMDD'));
  }
  return dateRange;
};

const handleChart = dateReports => R.map(
  (ele) => {
    if (dateReports[ele]) {
      return dateReports[ele];
    }
    return {
      count: 0,
      report_time: ele,
    };
  }
);


class MultiDayPerformance extends React.PureComponent {

  render() {
    const { data, timeRange } = this.props;

    const chartTimeRange = handleTimeRange(timeRange);
    const dateReports = R.indexBy(R.prop('report_time'))(data);
    const chartData = handleChart(dateReports)(chartTimeRange);

    return (
      <div styleName="container">
        <div
          styleName="wrapper"
        >
          <h2>操作標籤</h2>
          <div
            styleName="summary"
            style={{
              marginTop: '34px',
              marginBottom: '32px',
            }}
          >
            <p>總操作標籤數</p>
            <p styleName="block__number">{humanize.numberFormat(countSum(data), 0)}</p>
          </div>
          <div
            style={{
              height: '300px',
            }}
          >
            <SingleLineChart
              data={chartData}
              range={chartTimeRange}
              marginTop={20}
              marginRight={20}
              marginBottom={30}
              marginLeft={50}
            />
          </div>
        </div>
      </div>
    );
  }
}

MultiDayPerformance.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  timeRange: PropTypes.arrayOf(PropTypes.string),
};

export default CSSModules(MultiDayPerformance, styles);
