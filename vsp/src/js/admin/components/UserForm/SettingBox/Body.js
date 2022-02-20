import PropTypes from 'prop-types';
import React from 'react';

import Row from './Row';

class Body extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: [],
      groupOptions: [],
      roleOptions: [],
      filteredGroupOptions: [],
    };
    this.handleRowChange = this.handleRowChange.bind(this);
    this.onDeleteRow = this.onDeleteRow.bind(this);
    this.getContent = this.getContent.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      settings: nextProps.settings,
      groupOptions: nextProps.groupOptions,
      roleOptions: nextProps.roleOptions,
    });
  }

  onDeleteRow = (rowId) => {
    if (rowId !== 0) {
      const settings = this.state.settings;
      settings.splice(rowId, 1);
      this.setState({ settings });
    }
  };

  getContent = () => {
    const curSetting = this.state.settings;
    return curSetting;
  }

  handleRowChange = rowId =>
    (key, value) => {
      const settings = this.state.settings;

      // for push new row when editing the latest row
      if (rowId === settings.length - 1 && typeof settings[rowId + 1] === 'undefined') {
        settings.push(
          {
            group_id: 0,
            role_id: 0,
            enable_upload: 0,
          }
        );
      }

      // set upload switch data
      let rowSet = {};
      if (key === 'enable_upload') {
        rowSet = { ...settings[rowId], [key]: value ? 1 : 0 };
      } else {
        rowSet = {
          ...settings[rowId],
          [key]: value,
          enable_upload: key === 'role_id' && [4, 5].includes(value) ? 0 : 1,
        };
      }
      settings.splice(rowId, 1, rowSet);

      // check cur groups
      const selectGroup = settings.map(setting => (
        setting.group_id
      ));
      this.setState({ settings, filteredGroupOptions: selectGroup });
    }
  render() {
    return (
      <div>
        {this.state.settings.map((s, idx) => (
          <Row
            key={idx}
            groupOptions={this.state.groupOptions}
            roleOptions={this.state.roleOptions}
            filteredGroupOptions={this.state.filteredGroupOptions}
            groupVal={s.group_id}
            roleVal={s.role_id}
            doUploadVal={s.enable_upload === 1}
            modify={this.handleRowChange(idx)}
            clearRow={() => this.onDeleteRow(idx)}
          />
        ))}
      </div>
    );
  }
}

Body.propTypes = {
  settings: PropTypes.arrayOf(PropTypes.object),
  groupOptions: PropTypes.arrayOf(PropTypes.object),
  roleOptions: PropTypes.arrayOf(PropTypes.object),
};

Body.defaultProps = {
  settings: [
    {
      group_id: 1,
      role_id: 1,
      enable_upload: 0,
    },
  ],
};

export default Body;
