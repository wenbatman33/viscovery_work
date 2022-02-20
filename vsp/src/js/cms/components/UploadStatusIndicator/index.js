import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import TipsUploader from './TipsUploader';
import ExpandUploader from './ExpandUploader';
import styles from './styles.scss';

class UploadStatusIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 1, // [INIT, HOVER, EXPAND]
      uploads: [],
      counter: {
        uploadCount: 0,
        doneCount: 0,
        failCount: 0,
      },

    };
    this.onExpand = this.onExpand.bind(this);
    this.offExpand = this.offExpand.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const nextCounter = {
      uploadCount: nextProps.uploads.filter(u => u.status <= 1).length,
      doneCount: nextProps.uploads.filter(u => u.status === 2).length,
      failCount: nextProps.uploads.filter(u => u.status >= 3).length,
    };

    this.setState({
      uploads: nextProps.uploads,
      counter: nextCounter,
    });
  }

  onExpand() {
    this.setState({ status: 3 });
  }

  offExpand() {
    this.setState({ status: 1 });
  }


  render() {
    switch (this.state.status) {
      case 3:
        return (
          <div styleName="uploaderExpand">
            <ExpandUploader
              count={this.state.counter}
              uploads={this.state.uploads}
              unExpand={this.offExpand}
              clearUploadClick={() => this.props.onFullDelete(this.state.uploads)}
              rmUpload={upload => this.props.onDelete(upload)}
              rdUpload={upload => this.props.onRedo(upload)}
            />
          </div>
        );
      default:
        return (
          <div styleName="uploaderBox">
            <TipsUploader
              view
              count={this.state.counter}
              click={this.onExpand}
            />
          </div>
        );
    }
  }

}

UploadStatusIndicator.propTypes = {
  uploads: PropTypes.arrayOf({
    file: PropTypes.object,
    series: PropTypes.number,
    status: PropTypes.number,
    progress: PropTypes.number,
  }),
  onDelete: PropTypes.func,
  onFullDelete: PropTypes.func,
  onRedo: PropTypes.func,
};

export default CSSModules(UploadStatusIndicator, styles);
