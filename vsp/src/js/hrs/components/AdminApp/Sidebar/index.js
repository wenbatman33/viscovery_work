import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import NavLink from './NavLink';

import styles from './Sidebar.scss';


const Sidebar = ({ pathname, getData }) => (
  <div styleName="container">
    <NavLink
      title="系統現況"
      to="system"
      pathname={pathname}
      getData={getData}
    />
    <div styleName="gray">
      <p>
        工作排程與派工
      </p>
    </div>
    <NavLink
      title="HRS 監管"
      to=""
      pathname={pathname}
      getData={getData}
    />
    <NavLink
      title="依劇集派工"
      to="episode"
      pathname={pathname}
      getData={getData}
    />
    <NavLink
      title="依人員派工"
      to="member"
      pathname={pathname}
      getData={getData}
    />
  </div>
);

Sidebar.propTypes = {
  pathname: PropTypes.string,
  getData: PropTypes.func,
};

export default CSSModules(Sidebar, styles);
