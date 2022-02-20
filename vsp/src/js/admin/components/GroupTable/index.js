import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { routerUtil } from 'utils';
import { Button } from 'vidya/Button';

import { NAME } from '../../constants';

import Table from './Table';
import EmptyTable from './EmptyTable';

import styles from './main.scss';

const onGroupCreate = () => {
  routerUtil.pushHistory(`/${NAME}/group/create`);
};

class GroupTable extends React.Component {
  componentDidMount() {
    this.props.requestGroups();
    this.props.requestCountries();
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="top">
          <h2>群組管理</h2>
          <Button vdSize="normal" vdStyle="secondary" onClick={onGroupCreate}>新增群組</Button>
        </div>
        { this.props.groups.length > 0 && this.props.countryOptions.length > 0 ?
          (<Table countries={this.props.countryOptions} data={this.props.groups} />) :
          (<EmptyTable createGroup={this.onGroupCreate} />) }
      </div>
    );
  }
}

GroupTable.propTypes = {
  groups: PropTypes.array,
  countryOptions: PropTypes.array,
  requestGroups: PropTypes.func,
  requestCountries: PropTypes.func,
};

export default CSSModules(GroupTable, styles);
