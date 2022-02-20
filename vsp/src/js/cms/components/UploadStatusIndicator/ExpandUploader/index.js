import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import ExpandHeader from './ExpandHeader';
import ExpandRow from './ExpandRow';
import styles from './styles.scss';


class ExpandUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 1, // [uploading, done, fail]
    };

    this.selectTab = this.selectTab.bind(this);
  }

  selectTab(e) {
    this.setState({ status: e });
  }

  render() {
    const filterUploads = _uploadFilter(this.props.uploads)(this.state.status);
    return (
      <div styleName="container">
        <ExpandHeader
          selected={this.state.status}
          count={this.props.count}
          tabClick={e => this.selectTab(e)}
          windowClick={() => this.props.unExpand()}
          clearClick={() => this.props.clearUploadClick()}
        />
        <div styleName="body">
          {filterUploads.map((upload, idx) => (
            <ExpandRow
              key={idx}
              status={upload.status || this.state.status}
              fileName={upload.file.name}
              size={upload.size}
              progress={Math.round(upload.progress)}
              clearClick={() => this.props.rmUpload(upload)}
              redoClick={() => this.props.rdUpload(upload)}
              seriesId={upload.series}
              errorCode={upload.errorCode}
            />
            )
          )}
        </div>
      </div>
    );
  }
}

ExpandUploader.propTypes = {
  count: PropTypes.object,
  uploads: PropTypes.array,
  unExpand: PropTypes.func,
  clearUploadClick: PropTypes.func,
  rmUpload: PropTypes.func,
  rdUpload: PropTypes.func,
};

const _uploadFilter = array => (status) => {
  if (status === 1) {
    return array.filter(u => u.status <= 1);
  } else if (status === 2) {
    return array.filter(u => u.status === 2);
  } else if (status === 3) {
    return array.filter(u => u.status >= 3);
  }
  return array;
};

export default CSSModules(ExpandUploader, styles);
