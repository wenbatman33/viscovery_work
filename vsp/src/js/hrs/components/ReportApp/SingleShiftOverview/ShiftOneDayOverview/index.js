import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';

import styles from './ShiftOneDayOverview.scss';
import SingleShiftTable from '../SingleShiftTable';

import ShiftSummary from '../../Overview/SingleDayOverview/ShiftSummary';

class ShiftOneDayOverview extends React.PureComponent {
  render() {
    const {
      shiftName,
      shiftId,
      efficiencyGoal,
      data,
      comparedData,
      workHours,
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
            marginBottom: '51px',
          }}
        >
          <h2 styleName="summary__title">
            {`${shiftName}產量`}
          </h2>
          <div
            style={{
              marginTop: '19px',
            }}
          >
            <ShiftSummary
              data={data[shiftId] || []}
              shiftWorkingTime={workHours * 3600}
              comparedData={comparedData[shiftId] || []}
            />
          </div>
        </div>
        <SingleShiftTable
          groupbyReports={data[shiftId] || []}
          efficiencyGoal={efficiencyGoal}
        />
      </div>
    );
  }
}

ShiftOneDayOverview.propTypes = {
  shiftId: PropTypes.number,
  efficiencyGoal: PropTypes.number,
  workHours: PropTypes.number,
  shiftName: PropTypes.string,
  data: PropTypes.object,
  comparedData: PropTypes.object,
};

export default CSSModules(ShiftOneDayOverview, styles);
