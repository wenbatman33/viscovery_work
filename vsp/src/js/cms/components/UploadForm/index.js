import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';

import styles from './styles.scss';

class UploadForm extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    files: PropTypes.arrayOf(
      PropTypes.instanceOf(File)
    ).isRequired,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    onBatchDelete: PropTypes.func,
  };

  componentWillReceiveProps(nextProps) {
    const { recognition } = this;
    for (const file of nextProps.files) {
      const index = this.props.files.indexOf(file);
      if (index === -1) {
        recognition.checked = false;
        break;
      }
    }
  }

  getValue = () => {
    const { recognition } = this;
    return recognition.checked;
  };

  handleChange = () => {
    const { getValue } = this;
    const { onChange } = this.props;
    if (onChange) {
      const value = getValue();
      onChange(value);
    }
  };

  handleDelete = (file) => {
    const { onDelete } = this.props;
    if (onDelete) {
      onDelete(file);
    }
  };

  render() {
    const { handleChange, handleDelete } = this;
    const { files, t } = this.props;
    return (
      <div styleName="form">
        <div styleName="option">
          <input type="checkbox" ref={(node) => { this.recognition = node; }} onChange={handleChange} />
          {t('autoAnalysis')}
        </div>
        <div styleName="files">
          {files.map((file, index) => (
            <div styleName="file" key={index}>
              <i styleName="icon" className="fa fa-file-video-o" />
              <div title={file.name}>{file.name}</div>
              <i styleName="action" className="fa fa-times-circle" onClick={() => handleDelete(file)} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(UploadForm, styles));
