import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './TagLink.scss';

class TagLink extends React.PureComponent {
  render() {
    const { text, onClick } = this.props;
    return (
      <div
        onClick={onClick}
        styleName="container"
      >
        <p>{text}</p>
      </div>
    );
  }
}

TagLink.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default CSSModules(TagLink, styles);
