import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.scss';

const AdButton = ({ onClick, background, icon, children }) => (
  <div
    onClick={onClick}
    styleName={`btn-${background}`}
  >
    <div>{children}</div>
    <i
      className={icon === 'plus' ? 'fa fa-plus' : 'fa fa-cog'}
      style={background === 'white' ? { color: 'black' } : { color: 'white' }}
      aria-hidden="true"
    />
  </div>
);

AdButton.propTypes = {
  onClick: PropTypes.func,
  background: PropTypes.oneOf(['white', 'blue']),
  icon: PropTypes.oneOf(['plus', 'wheel']),
  children: PropTypes.node,
};


export default CSSModules(AdButton, styles);
