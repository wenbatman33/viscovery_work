import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-checkbox-duet';

import { DropdownList } from 'vidya/Form';
import { Button } from 'vidya/Button';

import { handleMoreThanWord } from 'utils/stringUtil';

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

const handleStatus = status =>
  status === 2;

class Row extends React.PureComponent {
  render() {
    const {
      taskId,
      videoName,
      seriesName,
      priority,
      status,
      brandName,
      brandId,
      total,
      undone,
      toVideoClick,
      updateOneTaskPriority,
      releaseOneTask,
    } = this.props;

    return (
      <div styleName="row-container">
        <div
          styleName="checkbox"
          style={{
            width: handleBoxWidth('checkbox'),
          }}
        >
          <Checkbox
            value={taskId}
            disabled={handleStatus(status)}
          />
        </div>
        <div
          styleName="seriesName"
          style={{
            width: handleBoxWidth('seriesName'),
          }}
        >
          <p>
            { handleMoreThanWord(14)(seriesName) }
          </p>
        </div>
        <div
          styleName="videoName"
          style={{
            width: handleBoxWidth('videoName'),
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
          styleName="brandName"
          style={{
            width: handleBoxWidth('brandName'),
          }}
        >
          <p
            styleName="long__word"
          >{ brandName }</p>
        </div>
        <div
          styleName="brandId"
          style={{
            width: handleBoxWidth('brandId'),
          }}
        >
          <p>{ brandId }</p>
        </div>
        <div
          styleName="tagCount"
          style={{
            width: handleBoxWidth('tagCount'),
          }}
        >
          <p>{`${total - undone}/${total}`}</p>
        </div>
        <div
          styleName="priority"
          style={{
            width: handleBoxWidth('priority'),
          }}
        >
          {
            handleStatus(status) ?
              <p> HRS進行中 </p> :
              <DropdownList
                options={options}
                placeholder="選擇類別"
                onChange={({ value }) => {
                  updateOneTaskPriority(value);
                }}
                value={priority}
              />
          }
        </div>
        <div
          styleName="delete"
          style={{
            width: handleBoxWidth('delete'),
          }}
        >
          {
            handleStatus(status) ?
              null :
              <Button
                vdSize="icon"
                vdStyle="secondary"
                onClick={() => {
                  releaseOneTask();
                }}
              >
                -
              </Button>
          }
        </div>
      </div>
    );
  }
}

Row.propTypes = {
  taskId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  videoName: PropTypes.string,
  seriesName: PropTypes.string,
  brandName: PropTypes.string,
  brandId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  total: PropTypes.number,
  undone: PropTypes.number,
  priority: PropTypes.number,
  status: PropTypes.number,
  toVideoClick: PropTypes.func,
  updateOneTaskPriority: PropTypes.func,
  releaseOneTask: PropTypes.func,
};

export default CSSModules(Row, styles);
