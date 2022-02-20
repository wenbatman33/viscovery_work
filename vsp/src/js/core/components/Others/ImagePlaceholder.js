import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './ImagePlaceholder.scss';

class ImagePlaceholder extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);

    this.state = {
      success: false,
      error: false,
    };
  }

  handleSuccess(success) {
    return () => {
      this.setState({
        success,
      });
    };
  }

  handleError() {
    this.setState({
      error: true,
    });
  }

  render() {
    const { src, alt } = this.props;

    return (
      <div styleName="img-container">
        <div styleName={this.state.success ? 'hidden' : 'animated'} />
        <div styleName="center">
          <img
            src={src}
            alt={alt}
            styleName={this.state.success ? 'img' : 'hidden-img'}
            onLoad={this.handleSuccess(true)}
            onError={this.handleError}
          />
        </div>
      </div>
    );
  }
}

ImagePlaceholder.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

export default CSSModules(ImagePlaceholder, styles);

