import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import {
  toVideoClick,
  toUserClick,
} from '../../utils';

import Row from './Row';

import styles from './Table.scss';

export const handleBoxWidth = (className) => {
  const mapping = {
    number: '5%',
    account: '15%',
    videoName: '30%',
    model: '10%',
    brand: '15%',
    progress: '15%',
    spentTime: '10%',
  };

  return mapping[className];
};


class Table extends React.PureComponent {
  render() {
    return (
      <div styleName="container">
        <div styleName="row-container-header">
          <div
            styleName="number-header"
            style={{
              width: handleBoxWidth('number'),
            }}
          />
          <div
            styleName="account-header"
            style={{
              width: handleBoxWidth('account'),
            }}
          >
            <p>工作帳號</p>
          </div>
          <div
            styleName="videoName-header"
            style={{
              width: handleBoxWidth('videoName'),
            }}
          >
            <p>工作項目</p>
          </div>
          <div
            styleName="model-header"
            style={{
              width: handleBoxWidth('model'),
            }}
          >
            <p>種類</p>
          </div>
          <div
            styleName="brand-header"
            style={{
              width: handleBoxWidth('brand'),
            }}
          >
            <p>Brand ( done/all )</p>
          </div>
          <div
            styleName="progress-header"
            style={{
              width: handleBoxWidth('progress'),
            }}
          >
            <p>進度 ( done/all )</p>
          </div>
          <div
            styleName="spentTime-header"
            style={{
              width: handleBoxWidth('spentTime'),
            }}
          >
            <p>花費時間</p>
          </div>
        </div>
        <div
          styleName="pure-row-area"
        >
          {
            this.props.users
              .map(user => ({
                ...user,
                task: this.props.tasks.find(task => task.assignee_id === user.uid),
              }))
              .map((user, index) => (
                <Row
                  key={user.uid}
                  number={index + 1}
                  account={user.account}
                  videoName={R.path(['task', 'video_name'])(user)}
                  groupName={R.path(['task', 'group_name'])(user)}
                  modelId={R.path(['task', 'model_id'])(user)}
                  brand={R.path(['task', 'brand_name'])(user)}
                  total={R.path(['task', 'total'])(user)}
                  undone={R.path(['task', 'undone'])(user)}
                  latestStartDone={R.path(['task', 'current_start_done'])(user)}
                  startTime={R.path(['task', 'start_time'])(user)}
                  toVideoClick={toVideoClick(R.path(['task', 'video_id'])(user))}
                  toUserClick={toUserClick(user.uid)}
                />
            ))
          }
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
};

export default CSSModules(Table, styles);
