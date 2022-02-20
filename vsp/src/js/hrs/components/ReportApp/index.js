import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import moment from 'moment';
import routerUtil from 'utils/routerUtil';
import {
  bindQueryString,
} from 'utils/urlUtil';

import styles from './ReportApp.scss';

import SubNavbar from './SubNavbar';
import OverviewContainer from '../../containers/ReportAppContainer/OverviewContainer';
import SingleShiftOverviewContainer from '../../containers/ReportAppContainer/SingleShiftOverviewContainer';
import PersonalReportContainer from '../../containers/ReportAppContainer/PersonalReportContainer';
import SettingsContainer from '../../containers/ReportAppContainer/SettingsContainer';

class ReportApp extends React.PureComponent {
  getChildContext() {
    return {
      location: this.props.location,
    };
  }

  componentWillMount() {
    const { query } = this.props.location;
    if (!query.since || !query.to) {
      this.setDefaultDate();
    }
  }

  componentDidMount() {
    const {
      since,
      to,
    } = this.props.location.query;

    if (since && to) {
      if (since === to) {
        const compareSince = moment(since, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD');
        this.props.getGroupbyReports(compareSince, to);
      } else {
        this.props.getGroupbyReports(since, to);
      }
    }
    this.props.getAllShifts();
    this.props.getAllShiftMap();
    this.props.getAllUsers();
  }

  componentWillReceiveProps(nextProps) {
    const {
      since,
      to,
    } = this.props.location.query;

    const {
      since: nextSince,
      to: nextTo,
    } = nextProps.location.query;

    if (!nextSince || !nextTo) {
      this.setDefaultDate();
    }

    if (
      (!!nextSince && !!nextTo)
      && (since !== nextSince
      || to !== nextTo)
    ) {
      this.props.getGroupbyReports(nextSince, nextTo);

      if (nextSince === nextTo) {
        const compareSince = moment(nextSince, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD');
        this.props.getGroupbyReports(compareSince, nextTo);
      } else {
        this.props.getGroupbyReports(nextSince, nextTo);
      }
    }
  }

  setDefaultDate() {
    const { query, pathname } = this.props.location;
    const bindQS = bindQueryString(pathname);
    const mergedQuery = {
      ...query,
      since: moment().subtract(1, 'day').format('YYYYMMDD'),
      to: moment().subtract(1, 'day').format('YYYYMMDD'),
    };
    routerUtil.pushHistory(bindQS(mergedQuery));
  }

  render() {
    const {
      location,
      match,
    } = this.props;
    return (
      <div
        style={{
          height: 'calc(100% - 60px)',
        }}
      >
        <SubNavbar
          pathname={location.pathname}
          search={location.search}
        />
        <Switch>
          <Route exact path={`${match.url}/overview`} component={OverviewContainer} />
          <Route exact path={`${match.url}/shift`} component={SingleShiftOverviewContainer} />
          <Route exact path={`${match.url}/shift/:shiftId`} component={SingleShiftOverviewContainer} />
          <Route exact path={`${match.url}/personal`} component={PersonalReportContainer} />
          <Route exact path={`${match.url}/personal/:assigneeId`} component={PersonalReportContainer} />
          <Route path={`${match.url}/settings`} component={SettingsContainer} />
        </Switch>
      </div>
    );
  }
}

ReportApp.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
  }),
  match: PropTypes.object,
  getGroupbyReports: PropTypes.func,
  getReports: PropTypes.func,
  getAllShifts: PropTypes.func,
  getAllShiftMap: PropTypes.func,
  getAllUsers: PropTypes.func,
};

ReportApp.childContextTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
    search: PropTypes.string,
  }),
};

export default CSSModules(ReportApp, styles);
