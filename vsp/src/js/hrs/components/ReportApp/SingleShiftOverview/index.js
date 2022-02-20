import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import moment from 'moment';
import { DropdownList } from 'vidya/Form';

import styles from './SingleShiftOverview.scss';

import DateRangePicker from '../common/DateRangePicker';
import ShiftOneDayOverview from './ShiftOneDayOverview';
import ShiftMultiDayOverview from './ShiftMultiDayOverview';

import {
  filterBetween,
} from '../utils';

const groupbyShift = shiftMap => R.groupBy(ele =>
  R.prop('hrs_shift_id')(shiftMap.find(R.propEq('hrs_member_uid', ele.assignee_id)) || {})
);

const handleAccount = hrsMembers => groupbyReports =>
R.map(ele => ({
  ...ele,
  username: R.find(R.propEq('uid', ele.assignee_id))(hrsMembers)
        ? R.find(R.propEq('uid', ele.assignee_id))(hrsMembers).account : ele.username,
}))(groupbyReports);

class SingleShiftOverview extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      shiftId: null,
    };

    this.handleShift = this.handleShift.bind(this);
  }

  componentWillMount() {
    const {
      shiftId,
    } = this.props.match.params;

    const cacheShiftId = this.props.cache.shiftId || null;

    if (shiftId) {
      this.setState({
        shiftId: Number(shiftId),
      });
      this.props.setReportShiftCache(Number(shiftId));
    } else if (cacheShiftId) {
      this.setState({
        shiftId: Number(cacheShiftId),
      });
    }
  }

  handleShift(shiftId) {
    this.setState({
      shiftId,
    });
    this.props.setReportShiftCache(shiftId);
  }

  render() {
    const {
      since,
      to,
    } = this.props.location.query;

    const {
      shiftId,
    } = this.state;

    const {
      groupbyReports,
      shifts,
      shiftMaps,
      hrsMembers,
    } = this.props;

    const filterByTime = R.filter(filterBetween(since, to));
    const accountReports = handleAccount(hrsMembers)(groupbyReports);
    const filteredGroupbyReports = filterByTime(accountReports);

    const filterForCompare = R.filter(
      filterBetween(
        moment(since).subtract(1, 'day').format('YYYYMMDD'),
        moment(since).subtract(1, 'day').format('YYYYMMDD')
      )
    );

    const data = groupbyShift(shiftMaps)(filteredGroupbyReports);
    const comparedData = groupbyShift(shiftMaps)(filterForCompare(accountReports));

    const getFromShift = key => def => R.compose(
      R.propOr(def, key),
      R.defaultTo({}),
      R.find(R.propEq('hrs_shift_id', Number(shiftId)))
    );

    const shiftName = getFromShift('hrs_shift_name')('')(shifts);
    const efficiencyGoal = getFromShift('efficiency_goal')(0)(shifts);
    const workHours = getFromShift('working_hours')(0)(shifts);

    const shiftOptions = R.map(shift => ({
      label: shift.hrs_shift_name,
      value: shift.hrs_shift_id,
    }))(shifts);

    return (
      <div
        style={{
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            height: '60px',
            padding: '0 69px',
          }}
        >
          <div
            style={{
              width: '150px',
              marginRight: '30px',
            }}
          >
            <DropdownList
              options={shiftOptions}
              value={shiftId}
              onChange={({ value }) => {
                this.handleShift(value);
              }}
              placeholder="選擇班別"
            />
          </div>
          <DateRangePicker
            since={since}
            to={to}
          />
        </div>
        <div styleName="container">
          {
            since === to ?
              <ShiftOneDayOverview
                shiftName={shiftName}
                shiftId={shiftId}
                efficiencyGoal={efficiencyGoal}
                workHours={workHours}
                data={data}
                comparedData={comparedData}
              /> :
              <ShiftMultiDayOverview
                shiftName={shiftName}
                shiftId={shiftId}
                workHours={workHours}
                efficiencyGoal={efficiencyGoal}
                data={data}
                comparedData={comparedData}
                timeRange={[since, to]}
              />
          }
        </div>
      </div>
    );
  }
}

SingleShiftOverview.propTypes = {
  match: PropTypes.object,
  groupbyReports: PropTypes.arrayOf(PropTypes.object),
  params: PropTypes.shape({
    shiftId: PropTypes.string,
  }),
  cache: PropTypes.shape({
    shiftId: PropTypes.number,
  }),
  location: PropTypes.shape({
    query: PropTypes.object,
  }),
  shifts: PropTypes.arrayOf(PropTypes.object),
  shiftMaps: PropTypes.arrayOf(PropTypes.object),
  hrsMembers: PropTypes.arrayOf(PropTypes.object),
  setReportShiftCache: PropTypes.func,
};

export default CSSModules(SingleShiftOverview, styles);
