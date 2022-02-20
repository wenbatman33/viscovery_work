import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { msToTimeObject, timeObjectToString } from 'utils/timeUtil';
import Header from './Header';
import List from './List';
import { LOCALE_EN_US, LOCALE_ZH_CN, LOCALE_ZH_TW } from '../../../app/constants';

import styles from './styles.scss';

class TagList extends React.Component {
  static propTypes = {
    classes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        brands: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            frames: PropTypes.arrayOf(
              PropTypes.shape({
                position: PropTypes.number.isRequired,
              })
            ).isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    fps: PropTypes.number.isRequired,
    locale: PropTypes.string,
    onTimeSelect: PropTypes.func,
  };

  static defaultProps = {
    classes: [],
    fps: 30,
  };

  state = {
    classIndex: -1,
    brandIndex: -1,
    frameIndex: -1,
  };

  componentWillReceiveProps(nextProps) {
    const { handleClassSelect } = this;
    if (nextProps.classes.length !== this.props.classes.length) {
      handleClassSelect(-1);
      return;
    }
    for (const key of Object.keys(nextProps.classes)) {
      if (nextProps.classes[key].id !== this.props.classes[key].id) {
        handleClassSelect(-1);
        return;
      }
    }
  }

  handleClassSelect = (index) => {
    this.setState({
      classIndex: index,
      brandIndex: -1,
      frameIndex: -1,
    });
  };

  handleBrandSelect = (index) => {
    this.setState({
      brandIndex: index,
      frameIndex: -1,
    });
  };

  handleFrameSelect = (index) => {
    this.setState({
      frameIndex: index,
    });

    const { onTimeSelect } = this.props;
    if (onTimeSelect) {
      const { classes, fps } = this.props;
      const { classIndex, brandIndex } = this.state;
      const frames = Array.from(
        new Set(classes[classIndex].brands[brandIndex].frames.map(frame => frame.position))
      );
      const time = (frames[index] - 1) / fps;
      onTimeSelect(time);
    }
  };

  render() {
    const { handleClassSelect, handleBrandSelect, handleFrameSelect } = this;
    const { fps, locale } = this.props;
    const { classIndex, brandIndex, frameIndex } = this.state;
    const key = ((l) => {
      switch (l) {
        case LOCALE_ZH_CN:
          return 'name_zh_cn';
        case LOCALE_ZH_TW:
          return 'name_zh_tw';
        case LOCALE_EN_US:
        default:
          return 'name';
      }
    })(locale);
    const classes = this.props.classes.map(cls => (
      `${cls[key]} (${cls.brands.map(brand => brand.frames.length).reduce((a, b) => a + b, 0)})`
    ));
    const brands = classIndex >= 0
      ? this.props.classes[classIndex].brands.map(brand => `${brand[key]}(${brand.frames.length})`)
      : [];
    const frames = brandIndex >= 0
      ? Array.from(new Set(this.props.classes[classIndex].brands[brandIndex].frames.map((frame) => {
        const offset = Math.round(((frame.position - 1) * 1000) / fps);
        const time = msToTimeObject(offset);
        return timeObjectToString(time, '%H:%M:%S');
      })))
      : [];
    return (
      <div styleName="component">
        <div styleName="header">
          <Header />
        </div>
        <div styleName="body">
          <div styleName="list">
            <List labels={classes} index={classIndex} onSelect={handleClassSelect} />
          </div>
          <div styleName="list">
            <List labels={brands} index={brandIndex} onSelect={handleBrandSelect} />
          </div>
          <div styleName="list">
            <List labels={frames} index={frameIndex} onSelect={handleFrameSelect} />
          </div>
        </div>
      </div>
    );
  }
}

export default CSSModules(TagList, styles);
