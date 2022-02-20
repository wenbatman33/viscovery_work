/**
 * Created Date : 2016/9/6
 * Copyright (c) Viscovery.co
 * Author : Amdis Liu <amdis.liu@viscovery.co>
 * Contributor :
 * Description : The highest level container of the routing, renders the component
 * that given by react-router.
 */

import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import R from 'ramda';

import NavBar from './NavBarContainer';
import LoadingBarContainer from '../containers/LoadingBarContainer';

import * as actions from '../actions';
import {
  receiveToken,
  loadToken,
  requestBriefGroups,
  requestRoles,
  patchRole,
  logOut,
} from '../../auth/actions';

import { ApiUtil, LogUtil, LTracker, browserUtil, cookieUtil } from '../../utils';

import styles from './appStyles/app.scss';

import { actions as sharedActions } from '../../shared';

const localeStylesTemplate = locale =>
  `locale__${locale}`;

const handleLocaleStyleName = (stylesObj, defaultLocale = 'enus') => locale => (
  localeStylesTemplate(locale) in stylesObj ?
    localeStylesTemplate(locale) :
    localeStylesTemplate(defaultLocale)
);

const configTracker = () => {
  LTracker.init('vsp');
  LTracker.addBaseProp({
    client_info: {
      browser_vendor: browserUtil.name(),
      browser_version: browserUtil.version(),
    },
  });
  if (process.env.VERSION_NUMBER) {
    LTracker.addBaseProp({ version: process.env.VERSION_NUMBER });
  }
};

class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handle401 = this.handle401.bind(this);
    this.updateUserInTracker = this.updateUserInTracker.bind(this);
  }

  getChildContext() {
    return {
      locale: this.props.locale,
    };
  }

  componentWillMount() {
    ApiUtil.reg401handler(this.handle401);
    this.props.restoreLocale();
    this.props.loadToken();
  }

  componentDidMount() {
    configTracker();
    this.props.queryResourceConfig();
  }

  componentWillUpdate(nextProps) {
    this.updateUserInTracker(nextProps);
  }

  handle401() {
    LogUtil.info('app : 401 error, do log out.');
    this.props.logOut(true);
  }

  updateUserInTracker(nextProps) {
    const { user: pUser } = this.props;
    const { user: nUser } = nextProps;
    if (pUser === nUser) {
      return;
    }

    if (nUser) {
      LTracker.addBaseProp({ user_id: nUser.uid });
    } else {
      LTracker.removeBaseProp('user_id');
    }
  }

  render() {
    return (
      <div styleName={`root ${handleLocaleStyleName(styles)(this.props.locale)}`}>
        <LoadingBarContainer />
        <NavBar
          pathname={R.path(['pathname'])(this.props.location)}
        />
        <div styleName="app">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    locale: state.lang.locale,
    user: state.auth.user,
  }
);

const mapDispatchToProps = dispatch => (
  {
    receiveToken: (token) => {
      dispatch(receiveToken(token));
    },
    loadToken: () => {
      dispatch(loadToken());
    },
    logOut: (expired) => {
      dispatch(logOut(expired));
    },
    requestBriefGroups: () => {
      dispatch(requestBriefGroups());
    },
    requestRoles: () => {
      dispatch(requestRoles());
    },
    patchRole: () => {
      dispatch(patchRole(cookieUtil.getGroupKey(), cookieUtil.getRoleKey()));
    },
    restoreLocale: () => {
      const action = actions.restoreLocale();
      dispatch(action);
    },
    queryResourceConfig: () => {
      dispatch(sharedActions.queryResourceConfig());
    },
  }
);

App.propTypes = {
  locale: PropTypes.string,
  receiveToken: PropTypes.func,
  loadToken: PropTypes.func,
  logOut: PropTypes.func,
  children: PropTypes.node,
  user: PropTypes.object,
  restoreLocale: PropTypes.func,
  location: PropTypes.object,
  queryResourceConfig: PropTypes.func,
};

App.childContextTypes = {
  locale: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(App, styles, {
  allowMultiple: true,
}));
