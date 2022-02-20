import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';

import styles from './NavLink.scss';

const linkTo = basename => search => to => () => {
  routerUtil.pushHistory({
    pathname: `${basename}/${to}`,
    search,
  });
};

const handlePathname = basename => pathname =>
  (
    pathname.match(new RegExp(`^${basename}/?([A-Za-z_]*)`)) ?
    pathname.match(new RegExp(`^${basename}/?([A-Za-z_]*)`))[1] :
    null
  );

class NavLink extends React.PureComponent {
  render() {
    const {
      title,
      to,
      pathname,
      basename,
      search,
    } = this.props;

    const active = handlePathname(basename)(pathname) === to;
    return (
      <div
        styleName={active ? 'active-link' : 'link'}
        onClick={linkTo(basename)(search)(to)}
      >
        <p
          style={{
            margin: '0 16px',
            userSelect: 'none',
          }}
        >
          {title}
        </p>
      </div>
    );
  }
}

NavLink.propTypes = {
  to: PropTypes.string,
  pathname: PropTypes.string,
  basename: PropTypes.string,
  search: PropTypes.string,
  title: PropTypes.string,
};

export default CSSModules(NavLink, styles);
