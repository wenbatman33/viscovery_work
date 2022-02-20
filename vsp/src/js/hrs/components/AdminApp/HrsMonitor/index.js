import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Table from './Table';

import { isHrsDisptach } from '../../../utils';
import { translateTask } from '../utils';

import styles from './HrsMonitor.scss';

const filterUsers = user => isHrsDisptach(user) && user.isLogin;

class HrsMonitor extends React.PureComponent {
  render() {
    const HrsMembers = this.props.users.map(user => ({
      ...user,
      isLogin: this.props.onlineUserIds.includes(user.uid),
    }));

    const filteredTasks = this.props.tasks.filter(task => task.status === 2);
    const translatedTasks =
            filteredTasks.map(translateTask(this.props.brandsFromStructure, this.props.lang));


    return (
      <div styleName="container">
        <div styleName="top-area" />
        <div styleName="table">
          <Table
            tasks={translatedTasks}
            users={HrsMembers.filter(filterUsers)}
          />
        </div>
      </div>
    );
  }
}


HrsMonitor.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
  onlineUserIds: PropTypes.arrayOf(PropTypes.number),
  brandsFromStructure: PropTypes.object,
  lang: PropTypes.string,
};

export default CSSModules(HrsMonitor, styles);
