import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import { Checkbox } from 'react-checkbox-duet';


import { DropdownList } from 'vidya/Form';

import { sum } from 'utils/mathUtil';

import { handleBoxWidth } from './';

import styles from './Row.scss';

const options = [
  {
    value: 1,
    label: 1,
  },
  {
    value: 2,
    label: 2,
  },
  {
    value: 3,
    label: 3,
  },
  {
    value: 4,
    label: 4,
  },
  {
    value: 5,
    label: 5,
  },
];

const modelNameMapping = {
  1: 'FACE',
  6: 'Object',
  7: 'Scene',
};

const tagCountTemplate = brief => (sumOfTasksFunc) => {
  const total = sumOfTasksFunc('total');
  const undone = sumOfTasksFunc('undone');

  return brief ? `${total}` : `${total - undone}/${total} (${Math.floor(((total - undone) * 100) / total)}%)`;
};


class Row extends React.PureComponent {
  render() {
    const {
      videoId,
      tasks,
      number,
      videoName,
      seriesName,
      groupName,
      source,
      priority,
      filter,
      toVideoClick,
      updateOneVideoPriority,
    } = this.props;
    const groupByModelId = R.groupBy(task => task.model_id);
    const groupedTasks = groupByModelId(tasks);
    const handleBoxWidthByFilter = handleBoxWidth(filter);

    const sumOfTasks = sum(tasks);

    return (
      <div styleName="row-container">
        <div
          styleName="checkbox"
          style={{
            width: handleBoxWidthByFilter('checkbox'),
          }}
        >
          <Checkbox
            value={videoId}
          />
        </div>
        <div
          styleName="number"
          style={{
            width: handleBoxWidthByFilter('number'),
          }}
        >
          <p>{ number }</p>
        </div>
        <div
          styleName="seriesName"
          style={{
            width: handleBoxWidthByFilter('seriesName'),
          }}
        >
          <p
            styleName="long__word"
          >
            { seriesName }
          </p>
        </div>
        <div
          styleName="videoName"
          style={{
            width: handleBoxWidthByFilter('videoName'),
          }}
        >
          <p
            onClick={toVideoClick}
            styleName="videoName__word"
          >
            { videoName }
          </p>
        </div>
        <div
          styleName="account"
          style={{
            width: handleBoxWidthByFilter('account'),
          }}
        >
          <p
            styleName="long__word"
          >{ groupName }</p>
        </div>
        <div
          styleName="source"
          style={{
            width: handleBoxWidthByFilter('source'),
          }}
        >
          <p
            styleName="long__word"
          >{ source }</p>
        </div>
        <div
          styleName="tagCount"
          style={{
            width: handleBoxWidthByFilter('tagCount'),
          }}
        >
          <div
            styleName="tagCount__trigger"
          >
            <p
              style={{
                textDecoration: 'underline',
              }}
            >
              { filter === 1 ?
                  tagCountTemplate(true)(sumOfTasks) : tagCountTemplate(false)(sumOfTasks) }
            </p>
            <div styleName="tagCount__tooltip">
              {
                Object.keys(groupedTasks).map(modelId =>
                  <div key={modelId}>
                    <small>
                      {
                        filter === 1 ?
                          `${modelNameMapping[modelId]}: ${tagCountTemplate(true)(sum(groupedTasks[modelId]))}` :
                          `${modelNameMapping[modelId]}: ${tagCountTemplate(false)(sum(groupedTasks[modelId]))}`
                      }
                    </small>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        {
          filter === 1 ?
            <div
              styleName="priority"
              style={{
                width: handleBoxWidthByFilter('priority'),
              }}
            >
              <DropdownList
                options={options}
                placeholder="選擇類別"
                onChange={({ value }) => {
                  updateOneVideoPriority(value);
                }}
                value={priority}
              />
            </div>
          : null
        }
      </div>
    );
  }
}

Row.propTypes = {
  videoId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  tasks: PropTypes.arrayOf(PropTypes.object),
  number: PropTypes.number,
  seriesName: PropTypes.string,
  videoName: PropTypes.string,
  groupName: PropTypes.string,
  source: PropTypes.string,
  priority: PropTypes.number,
  filter: PropTypes.number,
  toVideoClick: PropTypes.func,
  updateOneVideoPriority: PropTypes.func,
};

export default CSSModules(Row, styles);
