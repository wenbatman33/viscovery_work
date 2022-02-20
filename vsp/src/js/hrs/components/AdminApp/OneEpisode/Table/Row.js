import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Checkbox } from 'react-checkbox-duet';

import { handleMoreThanWord } from 'utils/stringUtil';

import { handleBoxWidth } from './';
import AssigneeAccount from './AssigneeAccount';

import styles from './Row.scss';

const statusWording = {
  0: '等待中',
  1: '等待中',
  2: '進行中',
  3: '已結束',
  4: '已結束',
};

const handleStatus = status =>
  [2, 3, 4].includes(status);

class Row extends React.PureComponent {
  render() {
    const {
      taskId,
      number,
      brandName,
      brandId,
      tagCount,
      assigneeAccount,
      assigneeId,
      status,
      toUserClick,
      updateOneTaskAssignee,
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
          styleName="number"
          style={{
            width: handleBoxWidth('number'),
          }}
        >
          <p>{ number }</p>
        </div>
        <div
          styleName="brandName"
          style={{
            width: handleBoxWidth('brandName'),
          }}
        >
          <p>{ handleMoreThanWord(14)(brandName) }</p>
        </div>
        <div
          styleName="brandId"
          style={{
            width: handleBoxWidth('brandId'),
          }}
        >
          <p>{ handleMoreThanWord(14)(brandId) }</p>
        </div>
        <div
          styleName="tagCount"
          style={{
            width: handleBoxWidth('tagCount'),
          }}
        >
          <p>{ tagCount }</p>
        </div>
        <div
          styleName="assigneeAccount"
          style={{
            width: handleBoxWidth('assigneeAccount'),
          }}
        >
          {
            <AssigneeAccount
              status={status}
              assigneeName={assigneeAccount}
              assigneeId={assigneeId}
              toUserClick={toUserClick}
              updateOneTaskAssignee={updateOneTaskAssignee}
            />
          }
        </div>
        <div
          styleName="status"
          style={{
            width: handleBoxWidth('status'),
          }}
        >
          { statusWording[status] }
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
  assigneeId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  number: PropTypes.number,
  brandName: PropTypes.string,
  brandId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  tagCount: PropTypes.string,
  assigneeAccount: PropTypes.string,
  status: PropTypes.number,
  toUserClick: PropTypes.func,
  updateOneTaskAssignee: PropTypes.func,
};

export default CSSModules(Row, styles);
