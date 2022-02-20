import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import Row from './Row';

import {
  toUserClick,
} from '../../utils';

import styles from './Table.scss';

const modelNameMapping = {
  1: 'FACE',
  6: 'Object',
  7: 'Scene',
};

export const handleBoxWidth = (className) => {
  const mapping = {
    checkbox: '5%',
    number: '5%',
    brandName: '20%',
    brandId: '20%',
    tagCount: '15%',
    assigneeAccount: '25%',
    status: '10%',
  };

  return mapping[className];
};


class Table extends React.PureComponent {
  render() {
    const sortedTasks = R.sortBy(R.path(['task_id']))(this.props.tasks);
    return (
      <div styleName="container">
        <div styleName="modelName">
          <h3>{modelNameMapping[this.props.modelId]}</h3>
        </div>
        <div styleName="row-container-header">
          <div
            styleName="checkbox-header"
            style={{
              width: handleBoxWidth('checkbox'),
            }}
          />
          <div
            styleName="number-header"
            style={{
              width: handleBoxWidth('number'),
            }}
          />
          <div
            styleName="brandName-header"
            style={{
              width: handleBoxWidth('brandName'),
            }}
          >
            <p>Brand</p>
          </div>
          <div
            styleName="brandId-header"
            style={{
              width: handleBoxWidth('brandId'),
            }}
          >
            <p>BrandID</p>
          </div>
          <div
            styleName="tagCount-header"
            style={{
              width: handleBoxWidth('tagCount'),
            }}
          >
            <p>標籤數 (done/all)</p>
          </div>
          <div
            styleName="assigneeAccount-header"
            style={{
              width: handleBoxWidth('assigneeAccount'),
            }}
          >
            <p>工作者</p>
          </div>
          <div
            styleName="status-header"
            style={{
              width: handleBoxWidth('status'),
            }}
          >
            <p>狀態</p>
          </div>
        </div>
        <div
          styleName="pure-row-area"
        >
          {
            sortedTasks.map((task, index) => (
              <Row
                key={task.task_id}
                taskId={task.task_id}
                number={index + 1}
                brandName={task.brand_name}
                brandId={task.brand_id}
                tagCount={`${task.total - task.undone}/${task.total}`}
                assigneeAccount={R.path(['account'])(this.props.users.find(user => user.uid === task.assignee_id))}
                assigneeId={R.path(['uid'])(this.props.users.find(user => user.uid === task.assignee_id))}
                status={task.status}
                toUserClick={toUserClick(task.assignee_id)}
                updateOneTaskAssignee={this.props.updateOneTaskAssignee(task.task_id)}
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
  modelId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  updateOneTaskAssignee: PropTypes.func,
};

export default CSSModules(Table, styles);
