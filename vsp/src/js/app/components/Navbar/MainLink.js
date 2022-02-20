import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';


import styles from './MainLink.scss';

const linkTo = to => () => {
  routerUtil.pushHistory(to);
};

export const handlePathname = to => pathname =>
  pathname && pathname.match(new RegExp(`^${to}`));

class MainLink extends React.PureComponent {
  render() {
    const {
      style,
      title,
      to,
    } = this.props;

    const {
      pathname,
    } = this.props.location;

    const allowModule = this.props.permissions || [];

    const active = handlePathname(to)(pathname);
    return (
      allowModule.includes(to) ?
        (
          <li
            styleName={active ? 'active' : 'container'}
            style={style}
            onClick={linkTo(to)}
          >
            <p>
              {title}
            </p>
          </li>
        ) :
        null
    );
  }
}

MainLink.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.string,
  to: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  permissions: PropTypes.arrayOf(PropTypes.string),
};

MainLink.defaultProps = {
  to: '/#',
};

export default withRouter(CSSModules(MainLink, styles));
