import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import moment from 'moment';

import styles from './Overview.scss';

import SingleDayOverview from './SingleDayOverview';
import MultiDayOverview from './MultiDayOverview';
import DateRangePicker from '../common/DateRangePicker';


import {
  filterBetween,
} from '../utils';

const groupbyShift = shiftMap => R.groupBy(ele =>
  R.prop('hrs_shift_id')(shiftMap.find(R.propEq('hrs_member_uid', ele.assignee_id)) || {})
);

const filterKeyUndefined = R.omit(['undefined']);

const handleAccount = hrsMembers => groupbyReports =>
R.map(ele => ({
  ...ele,
  username: R.find(R.propEq('uid', ele.assignee_id))(hrsMembers)
        ? R.find(R.propEq('uid', ele.assignee_id))(hrsMembers).account : ele.username,
}))(groupbyReports);

class Overview extends React.PureComponent {
  render() {
    const {
      since,
      to,
    } = this.props.location.query;

    const {
      groupbyReports,
      shifts,
      shiftMaps,
      hrsMembers,
    } = this.props;

    const accountReport = handleAccount(hrsMembers)(groupbyReports);

    const timeRange = [since, to];

    const filterByTime = R.filter(filterBetween(since, to));
    const filteredGroupbyReports = filterByTime(accountReport);

    const filterForCompare = R.filter(
      filterBetween(
        moment(since).subtract(1, 'day').format('YYYYMMDD'),
        moment(since).subtract(1, 'day').format('YYYYMMDD')
      )
    );

    let data = groupbyShift(shiftMaps)(filteredGroupbyReports);
    data = filterKeyUndefined(data);
    const compareData = groupbyShift(shiftMaps)(filterForCompare(accountReport));
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
          <DateRangePicker
            since={this.props.location.query.since}
            to={this.props.location.query.to}
          />
        </div>
        <div styleName="container">

          {
            since === to ?
              <SingleDayOverview
                groupbyReports={data}
                comparedGroupbyReports={filterKeyUndefined(compareData)}
                shifts={shifts}
              /> :
              <MultiDayOverview
                timeRange={timeRange}
                groupbyReports={data}
                shifts={shifts}
              />
          }
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  groupbyReports: PropTypes.arrayOf(PropTypes.object),
  location: PropTypes.shape({
    query: PropTypes.object,
  }),
  timeRange: PropTypes.arrayOf(PropTypes.string),
  shifts: PropTypes.arrayOf(PropTypes.object),
  shiftMaps: PropTypes.arrayOf(PropTypes.object),
  hrsMembers: PropTypes.arrayOf(PropTypes.object),
};

export default CSSModules(Overview, styles);
