import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './RegularLink.scss';

class RegularLink extends React.PureComponent {
  render() {
    const {
      style,
      title,
      onClick,
    } = this.props;
    return (
      <div
        styleName="container"
        style={style}
      >
        <p
          onClick={onClick}
        >
          {title}
        </p>
      </div>
    );
  }
}

RegularLink.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export default CSSModules(RegularLink, styles);
