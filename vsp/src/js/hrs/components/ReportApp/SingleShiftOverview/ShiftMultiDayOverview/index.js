import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';

import styles from './ShiftMultiDayOverview.scss';

import ShiftMultiDaySummary from './ShiftMultiDaySummary';
import MultiPeoplePerformance from './MultiPeoplePerformance';

class ShiftMultiDayOverview extends React.PureComponent {
  render() {
    const {
      shiftName,
      shiftId,
      efficiencyGoal,
      workHours,
      data,
      timeRange,
    } = this.props;
    return (
      <div>
        <p
          style={{
            fontSize: '48px',
          }}
        >
          {shiftName}
        </p>
        <div
          style={{
            background: 'white',
            padding: '32px',
            marginTop: '8px',
            marginBottom: '30px',
          }}
        >
          <h2 styleName="summary__title">
            操作標籤
          </h2>
          <div
            style={{
              marginTop: '19px',
            }}
          >
            <ShiftMultiDaySummary
              data={data[shiftId] || []}
            />
          </div>
        </div>
        <MultiPeoplePerformance
          data={data[shiftId] || []}
          timeRange={timeRange}
          workHours={workHours}
          efficiencyGoal={efficiencyGoal}
        />
      </div>
    );
  }
}

ShiftMultiDayOverview.propTypes = {
  shiftId: PropTypes.number,
  efficiencyGoal: PropTypes.number,
  workHours: PropTypes.number,
  shiftName: PropTypes.string,
  data: PropTypes.object,
  comparedData: PropTypes.object,
  timeRange: PropTypes.arrayOf(PropTypes.string),
};

export default CSSModules(ShiftMultiDayOverview, styles);
