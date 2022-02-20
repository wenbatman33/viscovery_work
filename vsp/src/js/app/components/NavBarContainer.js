/**
* Created Date : 2016/9/7
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description : The contianer for UI navigation bar. Responsible for handling user-clicked items.
 * User-clicked item is identified by event key.
*/
import { connect } from 'react-redux';

import { cookieUtil } from 'utils';
import Navbar from './Navbar';
import { LOCALE_ZH_CN, LOCALE_ZH_TW } from '../../app/constants';
import auth from '../../auth';

import * as actions from '../actions';

const mapStateToProps = state => ({
  username: state.auth.user ? state.auth.user.username : state.auth.user,
  active: !!cookieUtil.getToken(),
  permissions: cookieUtil.getPermission() || [],
  groupName: cookieUtil.getGroup() || 'Anonymous',
  roleName: (state[auth.constants.NAME].currentRole
    && ((state.lang.locale === LOCALE_ZH_CN && state[auth.constants.NAME].currentRole.name_zh_cn)
    || (state.lang.locale === LOCALE_ZH_TW && state[auth.constants.NAME].currentRole.name_zh_tw)
    || state[auth.constants.NAME].currentRole.name)
  ) || 'Anonymous',
  locale: state.lang.locale,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(auth.actions.logOut()),
  changeLocale: locale => dispatch(actions.changeLocale(locale)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
