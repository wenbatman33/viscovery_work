import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';
import styles from './HrsAdminDropdownMenu.scss';

const dispatchable = permissions => permissions.includes('/hrs/dispatch');

const HrsAdminDropdownMenu = ({ permissions, t }) => (
  <ul
    role="group"
    styleName="container"
  >
    <li
      role="menuitem"
      styleName="button"
      onClick={() => {
        routerUtil.pushHistory('/hrs/admin');
      }}
    >
      <p>
        {t('hrsDispatch')}
      </p>
    </li>
    <li
      role="menuitem"
      styleName="button"
      onClick={() => {
        routerUtil.pushHistory('/hrs/report/overview');
      }}
    >
      <p>
        {t('hrsReport')}
      </p>
    </li>
    {
      dispatchable(permissions)
      ? (
        <li
          role="menuitem"
          styleName="button"
          onClick={() => {
            routerUtil.pushHistory('/hrs/dispatch');
          }}
        >
          <p>
            {t('hrsOperation')}
          </p>
        </li>)
      : null
    }
  </ul>
);

HrsAdminDropdownMenu.propTypes = {
  t: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string),
};

export default translate([NAME])(CSSModules(HrsAdminDropdownMenu, styles));
