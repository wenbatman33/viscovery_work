import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.scss';

class Hover extends React.PureComponent {
  render() {
    const { onCheckBoxClick, onOverlayClick, index } = this.props;
    return (
      <div>
        <div styleName="overlay" onClick={onOverlayClick} />
        <div styleName="fake-checkbox" onClick={() => onCheckBoxClick(index)} />
      </div>
    );
  }
}

Hover.propTypes = {
  onCheckBoxClick: PropTypes.func,
  index: PropTypes.number.isRequired,
  onOverlayClick: PropTypes.func,
};

export default CSSModules(Hover, styles);
