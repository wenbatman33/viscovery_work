import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import NavLink from '../common/NavLink';

import styles from './SubNavbar.scss';

class SubNavbar extends React.PureComponent {
  render() {
    const {
      pathname,
      search,
    } = this.props;
    return (
      <div styleName="container">
        <NavLink
          pathname={pathname}
          basename="/hrs/report"
          search={search}
          to="overview"
          title="每日總表"
        />
        <NavLink
          pathname={pathname}
          basename="/hrs/report"
          search={search}
          to="shift"
          title="班別作業紀錄"
        />
        <NavLink
          pathname={pathname}
          basename="/hrs/report"
          search={search}
          title="個人作業紀錄"
          to="personal"
        />
        <NavLink
          pathname={pathname}
          basename="/hrs/report"
          search={search}
          to="settings"
          title="分組與標的設定"
        />
      </div>
    );
  }
}

SubNavbar.propTypes = {
  pathname: PropTypes.string,
  search: PropTypes.string,
};

export default CSSModules(SubNavbar, styles);
