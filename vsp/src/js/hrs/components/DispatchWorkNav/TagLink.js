import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './TagLink.scss';

class TagLink extends React.PureComponent {
  render() {
    const { text } = this.props;
    return (
      <div
        styleName="container"
      >
        <p>{text}</p>
      </div>
    );
  }
}

TagLink.propTypes = {
  text: PropTypes.string,
};

export default CSSModules(TagLink, styles);
