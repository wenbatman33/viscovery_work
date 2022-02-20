import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.scss';

class Tag extends React.Component {
  render() {
    const { color, label, value } = this.props;
    return (
      <div styleName="tag">
        <div styleName="circle" style={{ background: color }} />
        <div>{label} ({value})</div>
      </div>
    );
  }
}

Tag.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
};

export default CSSModules(Tag, styles);
