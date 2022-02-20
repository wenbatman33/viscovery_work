import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import R from 'ramda';
import moment from 'moment';

import styles from './MultiDayOverview.scss';

import Rank from './Rank';
import ShiftStatistics from './ShiftStatistics';
import MultiDayPerformance from './MultiDayPerformance';

import {
  concatObjectValue,
} from '../SingleDayOverview';

const handlePersonalRank = R.compose(
  R.map(ele => R.reduce(
    (pV, cV) => (
      {
        assigneeId: cV.assignee_id,
        name: cV.username,
        count: pV.count ? pV.count + cV.count : cV.count,
      }
    ),
    {},
    ele
  )),
  R.map(ele => ele[1]),
  R.toPairs,
  R.groupBy(ele => ele.assignee_id)
);

const defaultToZero = R.defaultTo(0);
const defaultToObject = R.defaultTo({});
const findShift = shiftId => R.compose(
  R.equals(shiftId),
  R.toString,
  R.prop('hrs_shift_id')
);

const getEffiencyGoal = R.compose(
  R.prop('efficiency_goal'),
  defaultToObject
);

const getShiftName = R.compose(
  R.prop('hrs_shift_name'),
  defaultToObject
);

const handleShiftRank = shifts => R.compose(
  R.map(ele => R.reduce(
    (pV, cV) => (
      {
        shiftId: ele[0],
        name: getShiftName(shifts.find(findShift(ele[0]))),
        count: defaultToZero(pV.count) + defaultToZero(cV.count),
      }
    ),
    {},
    ele[1]
  )),
  R.toPairs,
);

const filterUniqId = R.compose(
  R.length,
  R.uniq,
  R.map(ele => ele.assignee_id),
);

const handleMeanPeople = R.compose(
  R.mean,
  R.map(filterUniqId),
  R.values,
  R.groupBy(R.prop('report_time')),
);

const handleShiftStat = shifts => R.compose(
  R.map(ele => R.dissoc('time_assignee')(ele)),
  R.map(ele => ({
    ...ele,
    meanPeopleCount: handleMeanPeople(ele.time_assignee),
  })),
  R.map(ele => R.reduce(
    (pV, cV) => (
      {
        shiftId: ele[0],
        shiftName: getShiftName(shifts.find(findShift(ele[0]))),
        count: defaultToZero(pV.count) + defaultToZero(cV.count),
        sumOfTimeDuration:
          defaultToZero(pV.sumOfTimeDuration) + defaultToZero(cV.sum_of_time_duration),
        time_assignee: pV.time_assignee
        ? [{ report_time: cV.report_time, assignee_id: cV.assignee_id }, ...pV.time_assignee]
        : [{ report_time: cV.report_time, assignee_id: cV.assignee_id }],
        efficiencyGoal: getEffiencyGoal(shifts.find(findShift(ele[0]))),
      }
    ),
    {},
    ele[1]
  )),
  R.toPairs,
);

const addShiftId = R.mapObjIndexed((val, key) =>
  R.map(ele =>
    R.merge(ele, { shiftId: key })
  , val)
);

const sameDateAndShift = (a, b) => (a.report_time === b.report_time && a.shiftId === b.shiftId);

const handleShiftRange = shifts => R.compose(
  R.sortBy(R.prop('report_time')),
  R.map(ele => R.reduce(
    (pV, cV) => (
      {
        ...pV,
        shiftCounts: {
          ...pV.shiftCounts,
          [getShiftName(shifts.find(findShift(cV.shiftId)))]: cV.count,
        },
        count: defaultToZero(pV.count) + defaultToZero(cV.count),
        report_time: moment(ele[0]).format('YYYYMMDD'),
      }
    ),
    {},
    ele[1],
  )),
  R.toPairs,
  R.groupBy(ele => ele.report_time),
  R.map(ele => R.reduce(
    (pV, cV) => (
      {
        shiftId: cV.shiftId,
        report_time: cV.report_time,
        count: defaultToZero(pV.count) + defaultToZero(cV.count),
      }
    ),
    {},
    ele,
  )),
  R.groupWith(sameDateAndShift),
);

class MultiDayOverview extends React.PureComponent {
  render() {
    const {
      groupbyReports,
      timeRange,
      shifts,
    } = this.props;
    const flatData = concatObjectValue(groupbyReports);
    const personalRankData = handlePersonalRank(flatData);
    const shiftRankData = handleShiftRank(shifts)(groupbyReports);
    const shiftStatData = handleShiftStat(shifts)(groupbyReports);

    const addShiftData = addShiftId(groupbyReports);
    const flatDateData = concatObjectValue(addShiftData);
    const MultiDayData = handleShiftRange(shifts)(flatDateData);

    return (
      <div>
        <MultiDayPerformance
          data={MultiDayData}
          timeRange={timeRange}
        />
        <ShiftStatistics
          data={shiftStatData}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridColumnGap: '16px',
          }}
        >
          <Rank
            title="個人排名"
            data={personalRankData}
          />
          <Rank
            title="班級排名"
            data={shiftRankData}
          />
        </div>
      </div>
    );
  }
}

MultiDayOverview.propTypes = {
  groupbyReports: PropTypes.objectOf(PropTypes.array),
  shifts: PropTypes.arrayOf(PropTypes.object),
  timeRange: PropTypes.arrayOf(PropTypes.string),
};

export default CSSModules(MultiDayOverview, styles);
