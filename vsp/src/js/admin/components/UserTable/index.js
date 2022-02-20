import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { routerUtil } from 'utils';
import { Button } from 'vidya/Button';

import { NAME } from '../../constants';
import Table from './Table';
import EmptyTable from './EmptyTable';

import styles from './main.scss';

const onUserCreate = () => {
  routerUtil.pushHistory(`/${NAME}/user/create`);
};

class UserTable extends React.Component {
  componentWillMount() {
    this.props.requestUsers();
  }

  componentDidMount() {
    this.props.requestUsers();
  }


  render() {
    return (
      <div styleName="container">
        <div styleName="top">
          <div styleName="topContent">
            <div>
              <h2>帳號管理</h2>
            </div>
            <div>
              <Button vdSize="normal" vdStyle="secondary" onClick={onUserCreate}>新增帳號</Button>
            </div>
          </div>
        </div>
        { this.props.users.length > 0 ?
          (<Table data={this.props.users} />)
          : (<EmptyTable createUser={onUserCreate} />)
        }
      </div>
    );
  }
}

UserTable.propTypes = {
  users: PropTypes.array,
  requestUsers: PropTypes.func,
};

export default CSSModules(UserTable, styles);
