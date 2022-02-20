import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import moment from 'moment';

import styles from './MultiPeoplePerformance.scss';
import MultiLineChart from '../../common/MultiLineChart';
import ChartLegends from '../../common/ChartLegends';
import AssigneePerformance from './AssigneePerformance';

const colorRange = ['#0D96BA', '#04566B', '#8F1DBE', '#D059FF', '#0E6F65', '#17BCAB', '#66F2E3', '#66D6F2', '#4D4D4D', '#FAA43A', '#60BD68', '#B2912F', '#DECF3F'];

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

const defaultToZero = R.defaultTo(0);

const sameDayAssignId = (a, b) => {
  const findProps = R.props(['report_time', 'assignee_id']);
  return R.equals(findProps(a), findProps(b));
};

const assigneeIdAsKey = (assignReports) => {
  const result = {};
  const addKeyVal = (report) => {
    result[report.assignee_id] = report;
  };
  R.chain(addKeyVal, assignReports);

  return result;
};

const handleChartData = R.compose(
  R.map(ele => ({
    report_time: ele[1][0].report_time,
    data: assigneeIdAsKey(ele[1]),
  })),
  R.toPairs,
  R.groupBy(R.prop('report_time')),
  R.map(ele => R.reduce(
    (pV, cV) => ({
      ...pV,
      assignee_id: cV.assignee_id,
      username: cV.username,
      report_time: moment(cV.report_time).format('YYYYMMDD'),
      reports: {
        ...pV.reports,
        [cV.model_id]: cV.count,
      },
      count: defaultToZero(pV.count) + defaultToZero(cV.count),
      sum_of_time_duration:
      defaultToZero(pV.sum_of_time_duration) + defaultToZero(cV.sum_of_time_duration),
    }),
    {},
    ele,
  )),
  R.groupWith(sameDayAssignId),
);

const makeAssignList = R.compose(
  R.mapObjIndexed(val => val[0].username),
  R.groupBy(R.prop('assignee_id')),
);

const getEmptyTemplate = (assigneeKeys) => {
  const template = {};
  const addEmptyAssignee = (key) => {
    template[key] = { count: 0 };
  };
  R.chain(addEmptyAssignee, assigneeKeys);
  return template;
};

const handleEmptyData = emptyTemplate =>
  R.map(ele => ({
    report_time: ele.report_time,
    data: R.merge(emptyTemplate, ele.data),
  })
);

const handleEmptyDate = dateReports => R.map(
  (ele) => {
    if (dateReports[ele]) {
      return dateReports[ele];
    }
    return {
      report_time: ele,
      data: {},
    };
  }
);

const dividByAssignee = chartData => R.map(id =>
  R.map(ele => ({
    report_time: ele.report_time,
    data: R.pick([id], ele.data),
  }))(chartData)
);

class MultiPeoplePerformance extends React.PureComponent {

  render() {
    const { data, timeRange, efficiencyGoal, workHours } = this.props;

    const assginees = makeAssignList(data);
    const assigneeKeys = R.keys(assginees);
    const chartTimeRange = handleTimeRange(timeRange);

    const preparedData = handleChartData(data);
    const dateReports = R.indexBy(R.prop('report_time'))(preparedData);
    const fillEmptyDateData = handleEmptyDate(dateReports)(chartTimeRange);
    const emptyTemplate = getEmptyTemplate(assigneeKeys);
    const chartData = handleEmptyData(emptyTemplate)(fillEmptyDateData);

    const assigneeDatas = dividByAssignee(chartData)(assigneeKeys);

    return (
      <div>
        <div
          styleName="wrapper"
          style={{
            background: 'white',
            padding: '32px',
            marginTop: '8px',
            marginBottom: '30px',
          }}
        >
          <h2>操作標籤</h2>
          <div
            style={{
              height: '300px',
            }}
          >
            <div
              styleName="chartCol"
              style={{
                width: '20%',
                height: '100%',
              }}
            >
              <ChartLegends
                dataNames={assginees}
                colorRange={colorRange}
                marginTop={20}
                marginRight={0}
                marginBottom={30}
                marginLeft={5}
              />
            </div>
            <div
              styleName="chartCol"
              style={{
                width: '80%',
                height: '100%',
              }}
            >
              <MultiLineChart
                data={chartData}
                workGoal={efficiencyGoal * workHours}
                keys={assigneeKeys}
                colorRange={colorRange}
                range={chartTimeRange}
                marginTop={20}
                marginRight={20}
                marginBottom={30}
                marginLeft={50}
              />
            </div>
          </div>
        </div>
        {
          R.map((ele) => {
            const id = R.keys(ele[0].data)[0];
            const index = R.indexOf(id)(assigneeKeys);
            return (
              <div
                style={{
                  background: 'white',
                  padding: '32px',
                  marginTop: '8px',
                  marginBottom: '30px',
                }}
                key={id}
              >
                <AssigneePerformance
                  assigneeName={assginees[id]}
                  data={ele}
                  efficiencyGoal={efficiencyGoal}
                  workHours={workHours}
                  keys={[id]}
                  colorRange={[colorRange[index]]}
                  range={chartTimeRange}
                />
              </div>);
          })(assigneeDatas)
        }
      </div>
    );
  }
}

MultiPeoplePerformance.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  timeRange: PropTypes.arrayOf(PropTypes.string),
  efficiencyGoal: PropTypes.number,
  workHours: PropTypes.number,
};

export default CSSModules(MultiPeoplePerformance, styles);
