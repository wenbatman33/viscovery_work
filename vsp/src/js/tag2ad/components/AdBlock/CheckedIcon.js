import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.scss';

const ICON_URL = require('../../assets/checked.svg');

class CheckedIcon extends React.PureComponent {
  render() {
    return (
      <div onClick={this.props.onClick}>
        <img alt="checked" src={ICON_URL} styleName="checked-icon" />
      </div>
    );
  }
}

CheckedIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CSSModules(CheckedIcon, styles);
