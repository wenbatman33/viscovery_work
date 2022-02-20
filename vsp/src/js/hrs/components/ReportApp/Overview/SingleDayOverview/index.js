import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import {
  arrayToObject,
} from 'utils/dataTypeUtil';

import styles from './SingleDayOverview.scss';

import SummaryCard from './SummaryCard';
import ShiftPerformance from './ShiftPerformance';

export const concatObjectValue = R.compose(
  R.reduce(
    R.concat,
    []
  ),
  R.map(ele => ele[1]),
  R.toPairs
);

class SingleDayOverview extends React.PureComponent {
  render() {
    const {
      groupbyReports,
      comparedGroupbyReports,
      shifts,
    } = this.props;

    const shiftsDict = arrayToObject('hrs_shift_id')(shifts);
    return (
      <div>
        <SummaryCard
          data={concatObjectValue(groupbyReports)}
        />
        {
          R.compose(
            R.map(ele =>
              <ShiftPerformance
                key={ele[0]}
                data={ele[1]}
                comparedData={comparedGroupbyReports[ele[0]]}
                shiftName={R.prop('hrs_shift_name')(shiftsDict[ele[0]])}
                shiftId={ele[0]}
                shiftWorkingTime={R.prop('working_hours')(shiftsDict[ele[0]]) * 3600}
                workGoal={R.prop('working_hours')(shiftsDict[ele[0]]) * R.prop('efficiency_goal')(shiftsDict[ele[0]])}
              />
            ),
            R.toPairs
          )(groupbyReports)
        }
      </div>
    );
  }
}

SingleDayOverview.propTypes = {
  groupbyReports: PropTypes.objectOf(PropTypes.array),
  comparedGroupbyReports: PropTypes.objectOf(PropTypes.array),
  shifts: PropTypes.arrayOf(PropTypes.object),
};

export default CSSModules(SingleDayOverview, styles);
