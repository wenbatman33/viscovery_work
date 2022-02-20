import PropTypes from 'prop-types';
import React from 'react';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import Link from './Link';
import styles from './styles.scss';
import { PATH, NAME } from '../../constants';

class SideNav extends React.PureComponent {
  state = {
    selected: locationToEventKey(this.props.location.pathname),
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: locationToEventKey(nextProps.location.pathname),
    });
  }

  render() {
    return (
      <div styleName="root">
        <Link
          to={`/${PATH.KEY_MOMENT_REPORT}`}
          eventKey={1}
          selected={this.state.selected === 1}
        >
          {this.props.t('tagAdChanceReport')}
        </Link>
      </div>
    );
  }
}

const locationToEventKey = (location) => {
  if (location.endsWith(`/${PATH.KEY_MOMENT_REPORT}`) || location.endsWith(`/${PATH.KEY_MOMENT_REPORT}/`)) {
    return 1;
  }

  return null;
};

SideNav.propTypes = {
  t: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default translate([NAME])(CSSModules(SideNav, styles));
