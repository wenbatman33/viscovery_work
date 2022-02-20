import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './PreviewContent.scss';

const parseRect = rect => rect.split(',').map(x => Number(x));

const handleRectArray = (xRatio, yRatio, wRatio, hRatio) => (imageWidth, imageHeight) =>
  [
    imageWidth * xRatio,
    imageHeight * yRatio,
    imageWidth * wRatio,
    imageHeight * hRatio,
  ];

class PreviewContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.drawImage = this.drawImage.bind(this);
    this.clearImage = this.clearImage.bind(this);
  }
  componentDidMount() {
    this.drawImage();
  }
  componentDidUpdate() {
    this.clearImage();
    this.drawImage();
  }

  clearImage() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawImage() {
    const {
      rect: rectString,
      resolution,
    } = this.props;

    const [
      picWidth,
      picHeight,
    ] = resolution;

    const rectArray = parseRect(rectString);

    const [x, y, w, h] = rectArray;

    const xRatio = x / picWidth;
    const yRatio = y / picHeight;
    const wRatio = w / picWidth;
    const hRatio = h / picHeight;

    const handleRect = handleRectArray(xRatio, yRatio, wRatio, hRatio);

    const ctx = this.canvas.getContext('2d');
    let img = new Image();
    img.onload = () => {
      const {
        width: imageWidth,
        height: imageHeight,
      } = img;

      const ratio = this.container.offsetHeight / imageHeight;
      const rect = handleRect(imageWidth, imageHeight).map(n => n * ratio);
      const drawWidth = imageWidth * ratio;
      const drawHeight = imageHeight * ratio;
      this.canvas.width = drawWidth;
      this.canvas.height = drawHeight;
      ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
      ctx.rect(...rect);
      ctx.strokeStyle = '#00cc00';
      ctx.lineWidth = 5;
      ctx.stroke();
      img = null;
    };
    img.src = this.props.imageHost
    ? `${this.props.imageHost}${this.props.previewUrl}`
    : `${process.env.STATIC_HOST}${this.props.previewUrl}`;
  }

  render() {
    return (
      <div
        styleName="container"
        ref={(node) => { this.container = node; }}
      >
        <canvas
          ref={(node) => { this.canvas = node; }}
        />
      </div>
    );
  }
}

PreviewContent.propTypes = {
  imageHost: PropTypes.string,
  previewUrl: PropTypes.string,
  rect: PropTypes.string,
  resolution: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
};

PreviewContent.defaultProps = {
  previewUrl: '',
};

export default CSSModules(PreviewContent, styles);
