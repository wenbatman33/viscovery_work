import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';

import { Button } from 'vidya/Button';

import UpdatePriority from '../common/UpdatePriority';

import {
  RELEASE_SUCCESS_FEEDBACK,
  RELEASE_FAIL_FEEDBACK,
  PRIORITY_SUCCESS_FEEDBACK,
  PRIORITY_FAIL_FEEDBACK,
} from './';

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
                  this.props.clearFeedbackStatus();
                  this.props.releaseManyTasks(this.props.checkedList)
                    .then(() => { this.props.successFeedback(RELEASE_SUCCESS_FEEDBACK); })
                    .catch(() => {
                      this.props.failFeedback(RELEASE_FAIL_FEEDBACK);
                    });
                  this.props.clearCheckedList();
                }}
                style={{
                  marginRight: '8px',
                }}
              >
                釋出任務
              </Button>
              <Button
                vdStyle="secondary"
                vdSize="normal"
                onClick={() => {
                  this.handleStage(1);
                }}
              >
                修改順序
              </Button>
            </div>
          :
            <div
              style={{
                minWidth: '175px',
              }}
            >
              <UpdatePriority
                toExit={() => {
                  this.handleStage(0);
                  this.props.clearCheckedList();
                }}
                updatePriority={(priority) => {
                  this.props.clearFeedbackStatus();
                  return this.props.updateManyTasksPriority(this.props.checkedList)(priority)
                    .then(() => { this.props.successFeedback(PRIORITY_SUCCESS_FEEDBACK); })
                    .catch(() => {
                      this.props.failFeedback(PRIORITY_FAIL_FEEDBACK);
                    });
                }}
              />
            </div>
        }
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
  releaseManyTasks: PropTypes.func,
  updateManyTasksPriority: PropTypes.func,
  clearFeedbackStatus: PropTypes.func,
  successFeedback: PropTypes.func,
  failFeedback: PropTypes.func,
};

export default CSSModules(BatchOpe, styles);
