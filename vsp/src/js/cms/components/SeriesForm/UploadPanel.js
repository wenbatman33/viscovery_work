import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';

import styles from './styles.scss';

class UploadPanel extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onChange: PropTypes.func,
  };

  handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { upload } = this;
    upload.click();
  };

  handleChange = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = [];
    for (const file of event.target.files) {
      files.push(file);
    }
    /* eslint-disable no-param-reassign */
    event.target.value = null;
    /* eslint-enable */

    const { onChange } = this.props;
    if (onChange) {
      onChange(files);
    }
  };

  render() {
    const { handleClick, handleChange } = this;
    const { t } = this.props;
    return (
      <div styleName="panel">
        <i className="fa fa-file-video-o" />
        <div>
          <a onClick={handleClick}>{t('uploadNow')}</a>
          <input
            multiple
            type="file"
            accept="video/mp4,video/quicktime"
            ref={(node) => { this.upload = node; }}
            onChange={handleChange}
          />
        </div>
        <div>{t('uploadLater')}</div>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(UploadPanel, styles));
