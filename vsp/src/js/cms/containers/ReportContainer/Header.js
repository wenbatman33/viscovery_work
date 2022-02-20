import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { DropdownList } from 'vidya/Form';

import styles from './styles.scss';

class Header extends React.Component {
  static propTypes = {
    videos: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
    models: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
    videoId: PropTypes.number,
    modelId: PropTypes.number,
    onBack: PropTypes.func,
    onVideoSelect: PropTypes.func,
    onModelSelect: PropTypes.func,
  };

  static defaultProps = {
    videos: [],
    models: [],
  };

  state = {
    videoId: this.props.videoId,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.videoId !== this.state.videoId) {
      this.setState({
        videoId: nextProps.videoId,
      });
    }
  }

  handleBack = () => {
    const { onBack } = this.props;
    if (onBack) {
      onBack();
    }
  };

  handleVideoSelect = (video) => {
    this.setState({
      videoId: video.value,
    });

    const { onVideoSelect } = this.props;
    if (onVideoSelect) {
      onVideoSelect(video.value);
    }
  };

  handleModelSelect = (modelId) => {
    const { onModelSelect } = this.props;
    if (onModelSelect) {
      onModelSelect(modelId);
    }
  };

  render() {
    const { handleBack, handleVideoSelect, handleModelSelect } = this;
    const { videos, models, modelId } = this.props;
    const { videoId } = this.state;
    return (
      <div styleName="header">
        <div styleName="back" onClick={handleBack}>
          <i className="fa fa-chevron-left" />
        </div>
        <div styleName="videos">
          <DropdownList options={videos} value={videoId} onChange={handleVideoSelect} />
        </div>
        <div styleName="placeholder" />
        {models.map(model => (
          <div
            styleName={model.id === modelId ? 'model selected' : 'model'}
            key={model.id} onClick={() => handleModelSelect(model.id)}
          >
            {model.label.charAt(0).toUpperCase()}{model.label.substring(1)} ({model.value})
          </div>
        ))}
      </div>
    );
  }
}

export default CSSModules(Header, styles, { allowMultiple: true });
