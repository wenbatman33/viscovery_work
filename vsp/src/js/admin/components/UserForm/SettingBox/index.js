import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Header from './Header';
import Body from './Body';

import styles from './settingbox.scss';

class SettingBox extends React.Component {
  constructor(props) {
    super(props);

    this.getContent = this.getContent.bind(this);
  }

  getContent() {
    const permission = this.settingBoxBody.getContent();
    return permission.filter(p =>
      p.group_id >= 1 && p.role_id >= 1 && [0, 1].includes(p.enable_upload)
    );
  }

  render() {
    return (
      <div styleName="container">
        <Header />
        <Body
          groupOptions={this.props.groupOptions}
          roleOptions={this.props.roleOptions}
          settings={this.props.data}
          ref={(box) => { this.settingBoxBody = box; }}
        />
      </div>
    );
  }
}

SettingBox.propTypes = {
  groupOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  roleOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  data: PropTypes.array,
};

export default CSSModules(SettingBox, styles);
