import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';

import styles from './NavLink.scss';

const linkTo = to => () => {
  routerUtil.pushHistory(`/hrs/admin/${to}`);
};

const handlePathname = pathname =>
  (
    pathname.match(new RegExp('^/hrs/admin/?([A-Za-z]*)')) ?
    pathname.match(new RegExp('^/hrs/admin/?([A-Za-z]*)'))[1] :
    null
  );

class NavLink extends React.PureComponent {
  render() {
    const { title, to, pathname, getData } = this.props;
    const active = handlePathname(pathname) === to;
    return (
      <div
        styleName={active ? 'active' : 'container'}
        onClick={() => {
          linkTo(to)();
          getData();
        }}
      >
        <h3>{title}</h3>
      </div>
    );
  }
}

NavLink.propTypes = {
  title: PropTypes.string,
  to: PropTypes.string,
  pathname: PropTypes.string,
  getData: PropTypes.func,
};

NavLink.defaultProptypes = {
  title: '',
};

export default CSSModules(NavLink, styles);
