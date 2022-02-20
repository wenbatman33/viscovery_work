import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './PreviewContent.scss';

const PreviewContent = ({ previewUrl }) => (
  <img
    src={previewUrl}
    alt={'Preview'}
    styleName="img"
  />
);

PreviewContent.propTypes = {
  previewUrl: PropTypes.string,
};

PreviewContent.defaultProps = {
  previewUrl: '',
};

export default CSSModules(PreviewContent, styles);
