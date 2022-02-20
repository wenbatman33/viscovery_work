import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import routerUtil from 'utils/routerUtil';
import cookieUtil from 'utils/cookieUtil';
import { NAME } from '../../constants';

import styles from './AuthMenu.scss';

const linkTo = to => () => {
  routerUtil.pushHistory(to);
};

class AuthMenu extends React.PureComponent {
  render() {
    const {
      username,
      groupName,
      roleName,
      logout,
      t,
    } = this.props;
    const allowModule = cookieUtil.getPermission() || [];

    return (
      <ul
        role="group"
        styleName="container"
      >
        <div
          styleName="username"
        >
          <p
            styleName="text-overflow"
            title={username}
          >
            {username}
          </p>
        </div>
        <div
          styleName="groupName"
        >
          <h3
            styleName="text-overflow"
            title={groupName}
          >
            {groupName}
          </h3>
          <p
            styleName="roleName"
            title={roleName}
          >
            {roleName}
          </p>
        </div>
        <div styleName="action-area">
          <li
            role="menuitem"
            styleName="action__button"
            onClick={linkTo('/auth/signin/reselect')}
          >
            <p>
              {t('changeRole')}
            </p>
          </li>
          {
            allowModule.includes('/logout') ?
              <li
                role="menuitem"
                styleName="action__button"
                onClick={logout}
              >
                <p>
                  {t('logout')}
                </p>
              </li>
            :
              null
          }
        </div>
      </ul>
    );
  }
}

AuthMenu.propTypes = {
  username: PropTypes.string,
  groupName: PropTypes.string,
  roleName: PropTypes.string,
  logout: PropTypes.func,
  t: PropTypes.func,
};


export default new translate([NAME])(CSSModules(AuthMenu, styles));
