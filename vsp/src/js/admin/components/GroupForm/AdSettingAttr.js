import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { DropdownList } from 'vidya/Form';

import styles from './AdSettingAttr.scss';

class AdSettingAttr extends React.PureComponent {
  render() {
    return (
      <div styleName="container">
        <h2 styleName="title">商業營運</h2>
        <div styleName="lists-container">
          <div>
            商業模式*
            <DropdownList
              value={this.props.model}
              options={this.props.modelOptions}
              placeholder={'選擇類別'}
              onChange={this.props.onModelChange}
            />
          </div>
          <div>
            廣告平台*
            <DropdownList
              value={this.props.platform}
              options={this.props.platformOptions}
              placeholder={'選擇類別'}
              onChange={this.props.onPlatformChange}
            />
          </div>
          <div>
            影片識別碼*
            <DropdownList
              value={this.props.videoKey}
              options={this.props.videoKeysOptions}
              placeholder={'選擇類別'}
              onChange={this.props.onVideoKeyChange}
            />
          </div>
          <div>
            客製化廣告分類*
            <DropdownList
              value={this.props.category}
              options={this.props.customCategoryOptions}
              placeholder={'選擇類別'}
              onChange={this.props.onCategoryChange}
            />
          </div>
          <div>
            客製化廣告形式*
            <DropdownList
              value={this.props.type}
              options={this.props.customTypeOptions}
              placeholder={'選擇類別'}
              onChange={this.props.onTypeChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

AdSettingAttr.propTypes = {
  onModelChange: PropTypes.func,
  modelOptions: PropTypes.array,
  onPlatformChange: PropTypes.func,
  platformOptions: PropTypes.array,
  onVideoKeyChange: PropTypes.func,
  videoKeysOptions: PropTypes.array,
  onCategoryChange: PropTypes.func,
  customCategoryOptions: PropTypes.array,
  onTypeChange: PropTypes.func,
  customTypeOptions: PropTypes.array,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  platform: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  videoKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};


export default CSSModules(AdSettingAttr, styles);
