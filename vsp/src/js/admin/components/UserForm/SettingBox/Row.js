import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { Switch, DropdownList } from 'vidya/Form';

import styles from './row.scss';

class Row extends React.Component {
  constructor(props) {
    super(props);

    this.handleGroupSelect = this.handleGroupSelect.bind(this);
    this.handleRoleSelect = this.handleRoleSelect.bind(this);
    this.handleUploadStatus = this.handleUploadStatus.bind(this);
    this.filterGroupOpt = this.filterGroupOpt.bind(this);
    this.filterRoleOpt = this.filterRoleOpt.bind(this);
  }

  handleGroupSelect(option) {
    this.props.modify('group_id', option.value);
  }

  handleRoleSelect(option) {
    this.props.modify('role_id', option.value);
  }

  handleUploadStatus(val) {
    this.props.modify('enable_upload', val);
  }

  filterGroupOpt() {
    return this.props.groupOptions.filter(
      opt => !this.props.filteredGroupOptions.includes(opt.value) ||
        opt.value === this.props.groupVal
    );
  }

  filterRoleOpt() {
    if (this.props.groupVal === 0) {
      return this.props.roleOptions;
    } else if (this.props.groupVal === 1) {
      return this.props.roleOptions.filter(opt => opt.value <= 6);
    }
    return this.props.roleOptions.filter(opt => opt.value === 2 || opt.value >= 6);
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="groupDD">
          <DropdownList
            options={this.filterGroupOpt()}
            placeholder="選擇群組"
            onChange={this.handleGroupSelect}
            value={this.props.groupVal}
          />
        </div>
        <div styleName="roleDD">
          <DropdownList
            options={this.filterRoleOpt()}
            placeholder="選擇角色"
            onChange={this.handleRoleSelect}
            value={this.props.roleVal}
          />
        </div>
        <div styleName="switchInput">
          <Switch
            checked={this.props.doUploadVal}
            onChange={this.handleUploadStatus}
          />
        </div>
        <div styleName="manipulate">
          <button styleName="functionBtn" onClick={this.props.clearRow}>
            <i className="fa fa-trash" />
          </button>
        </div>
      </div>
    );
  }
}

Row.propTypes = {
  groupVal: PropTypes.number,
  roleVal: PropTypes.number,
  doUploadVal: PropTypes.bool,
  modify: PropTypes.func,
  clearRow: PropTypes.func,
  roleOptions: PropTypes.arrayOf(PropTypes.object),
  groupOptions: PropTypes.arrayOf(PropTypes.object),
  filteredGroupOptions: PropTypes.arrayOf(PropTypes.object),
};

export default CSSModules(Row, styles);
