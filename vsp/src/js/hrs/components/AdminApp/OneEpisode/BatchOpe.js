import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';

import { Button } from 'vidya/Button';

import AssignTaskContainer from '../../../containers/AdminAppContainer/AssignTaskContainer';

import styles from './BatchOpe.scss';

class BatchOpe extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleStage = this.handleStage.bind(this);

    this.state = {
      stage: 0,
    };
  }

  handleStage(stage) {
    this.setState({
      stage,
    });
  }

  render() {
    return (
      <div styleName="container">
        <div
          style={{
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              whiteSpace: 'nowrap',
            }}
          >
            <p
              styleName="redCircle"
            >
              {`${this.props.checkedList.length}`}
            </p>
            <p>{' 個 Brand 已選擇'}</p>
          </span>
        </div>
        <div styleName="right">
          {
            this.state.stage === 0 ?
              <div>
                <Button
                  vdStyle="secondary"
                  vdSize="normal"
                  onClick={() => {
                    this.props.clearCheckedList();
                  }}
                  style={{
                    marginRight: '8px',
                  }}
                >
                  取消選取
                </Button>
                <Button
                  vdStyle="secondary"
                  vdSize="normal"
                  onClick={() => {
                    this.handleStage(1);
                  }}
                >
                  重新分配
                </Button>
              </div>
            :
              <AssignTaskContainer
                updateTaskAssignee={(assigneeId) => {
                  this.props.clearFeedbackStatus();
                  return this.props.updateManyTasksAssignee(this.props.checkedList)(assigneeId)
                    .then(this.props.successFeedback)
                    .catch(() => {
                      this.props.failFeedback();
                    });
                }}
                toExit={() => {
                  this.handleStage(0);
                  this.props.clearCheckedList();
                }}
              />
          }
        </div>
      </div>
    );
  }
}

BatchOpe.propTypes = {
  checkedList: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  ),
  clearCheckedList: PropTypes.func,
  updateManyTasksAssignee: PropTypes.func,
  clearFeedbackStatus: PropTypes.func,
  successFeedback: PropTypes.func,
  failFeedback: PropTypes.func,
};

export default CSSModules(BatchOpe, styles);
