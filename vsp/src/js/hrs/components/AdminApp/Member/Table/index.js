import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import Row from './Row';
import TableTitle from './TableTitle';

import {
  toVideoClick,
} from '../../utils';

import styles from './Table.scss';

export const handleBoxWidth = (className) => {
  const mapping = {
    checkbox: '5%',
    seriesName: '20%',
    videoName: '20%',
    brandName: '15%',
    brandId: '15%',
    tagCount: '10%',
    priority: '10%',
    delete: '5%',
  };

  return mapping[className];
};


class Table extends React.PureComponent {
  render() {
    const updateOneTaskPriority = R.curry(this.props.updateOneTaskPriority);
    const sortedTasks = R.sortBy(R.prop('task_id'))(this.props.tasks);

    return (
      <div styleName="container">
        <div styleName="tableTitle">
          <TableTitle
            account={this.props.account}
            taskCount={this.props.tasks.length}
          />
        </div>
        <div styleName={this.props.tasks.length === 0 ? 'hide' : 'row-container-header'}>
          <div
            styleName="checkbox-header"
            style={{
              width: handleBoxWidth('checkbox'),
            }}
          />
          <div
            styleName="seriesName-header"
            style={{
              width: handleBoxWidth('seriesName'),
            }}
          >
            <p>劇名</p>
          </div>
          <div
            styleName="videoName-header"
            style={{
              width: handleBoxWidth('videoName'),
            }}
          >
            <p>集數</p>
          </div>
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
            <p>Brand ID</p>
          </div>
          <div
            styleName="tagCount-header"
            style={{
              width: handleBoxWidth('tagCount'),
            }}
          >
            <p>標籤數</p>
          </div>
          <div
            styleName="priority-header"
            style={{
              width: handleBoxWidth('priority'),
            }}
          >
            <p>Brand 處理順序</p>
          </div>
          <div
            styleName="delete-header"
            style={{
              width: handleBoxWidth('delete'),
            }}
          />
        </div>
        {
          sortedTasks.map(task => (
            <Row
              key={task.task_id}
              taskId={task.task_id}
              videoName={task.video_name}
              seriesName={task.series_name}
              brandName={task.brand_name}
              brandId={task.brand_id}
              total={task.total}
              undone={task.undone}
              priority={task.priority}
              status={task.status}
              toVideoClick={toVideoClick(task.video_id)}
              updateOneTaskPriority={updateOneTaskPriority(task.task_id)}
              releaseOneTask={() => {
                this.props.releaseOneTask(task.task_id);
              }}
            />
          ))
        }
      </div>
    );
  }
}

Table.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object),
  uid: PropTypes.number,
  account: PropTypes.string,
  updateOneTaskPriority: PropTypes.func,
  releaseOneTask: PropTypes.func,
};

export default CSSModules(Table, styles);
