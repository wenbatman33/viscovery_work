import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import styles from './ShiftInfoForm.scss';

import ShiftInfoCard from './ShiftInfoCard';
import Navbar from '../Navbar';

const groupByShiftId = R.groupBy(shift => shift.hrs_shift_id);
const mapToGetFirst = R.map(ele => ele[0]);

const handlePropsShifts = R.compose(
  mapToGetFirst,
  groupByShiftId,
);

class ShiftInfoForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleState = this.handleState.bind(this);
    this.handleByCol = this.handleByCol.bind(this);

    this.state = {
      ...handlePropsShifts(props.shifts),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shifts.length > 0 && this.props.shifts.length === 0) {
      this.setState({
        ...handlePropsShifts(nextProps.shifts),
      });
    }
  }

  handleState(key) {
    return value =>
      this.setState({
        [key]: value,
      });
  }

  handleByCol(id) {
    return col => (value) => {
      if (isNaN(Number(value))) {
        return null;
      }
      return this.handleState(id)(
        {
          ...this.state[id],
          [col]: value,
        }
      );
    };
  }

  render() {
    const {
      location,
      updateManyShifts,
    } = this.props;

    return (
      <div
        style={{
          height: '100%',
        }}
      >
        <Navbar
          pathname={location.pathname}
          search={location.search}
          confirm={
            () => updateManyShifts(R.values(this.state))
              .then(() => this.setState({
                ...handlePropsShifts(this.props.shifts),
              }))
          }
        />
        <div
          styleName="container"
        >
          <div styleName="row">
            {R.values(this.state).map(ele =>
              <ShiftInfoCard
                key={ele.hrs_shift_id}
                hrsShiftId={ele.hrs_shift_id}
                hrsShiftName={ele.hrs_shift_name}
                efficiencyGoal={ele.efficiency_goal}
                workingHours={ele.working_hours}
                workingDays={ele.working_days}
                onChange={this.handleByCol(ele.hrs_shift_id)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

ShiftInfoForm.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  shifts: PropTypes.arrayOf(PropTypes.object),
  updateManyShifts: PropTypes.func,
};

export default CSSModules(ShiftInfoForm, styles);
