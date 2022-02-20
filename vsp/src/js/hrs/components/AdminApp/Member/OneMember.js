import React from 'react';
import CSSModules from 'react-css-modules';
import { CheckboxGroup } from 'react-checkbox-duet';
import PropTypes from 'prop-types';
import R from 'ramda';

import { Banner } from 'vidya/Feedback';
import Modal from 'vidya/Dialogs/Modal';

import Table from './Table';
import BatchOpe from './BatchOpe';
import FailFeedbackContent from '../common/FailFeedbackContent';

import styles from './OneMember.scss';

const NORMAL = 0;
const BATCH_SUCCESS = 'BATCH_SUCCESS';

export const RELEASE_SUCCESS_FEEDBACK = '工作已釋出';
export const RELEASE_FAIL_FEEDBACK = '工作已開始進行，無法釋出';
export const PRIORITY_SUCCESS_FEEDBACK = '優先權調整成功';
export const PRIORITY_FAIL_FEEDBACK = '工作已開始進行，無法調整優先權，請重新操作';

class OneMember extends React.PureComponent {
  constructor(props) {
    super(props);

    this.clearCheckedList = this.clearCheckedList.bind(this);
    this.handleCheckedList = this.handleCheckedList.bind(this);
    this.handleFeedback = this.handleFeedback.bind(this);
    this.feedbackFailShow = this.feedbackFailShow.bind(this);
    this.feedbackSuccessShow = this.feedbackSuccessShow.bind(this);
    this.handleBatchSuccessText = this.handleBatchSuccessText.bind(this);

    this.state = {
      checkedList: [],
      feedback: NORMAL,
      batchSuccessText: '',
    };
  }

  handleCheckedList(checkedList) {
    this.setState({
      checkedList,
    });
  }

  handleFeedback(feedback) {
    this.setState({
      feedback,
    });
  }

  handleBatchSuccessText(batchSuccessText) {
    this.setState({
      batchSuccessText,
    });
  }

  feedbackFailShow(batchFailText) {
    this.modal.toShow();
    this.modal.switchContent(
      <FailFeedbackContent
        text={batchFailText}
        toExit={this.modal.toHide}
      />
    );
  }

  feedbackSuccessShow(batchSuccessText) {
    this.handleFeedback(BATCH_SUCCESS);
    this.handleBatchSuccessText(batchSuccessText);
    setTimeout(
      this.handleFeedback,
      3500,
      NORMAL,
    );
  }

  clearCheckedList() {
    this.setState({
      checkedList: [],
    });
  }

  render() {
    const filterTasksStatus = this.props.tasks.filter(task => [0, 1, 2].includes(task.status));
    const curriedUpdateManyTasksPriority = R.curry(this.props.updateManyTasksPriority);

    return (
      <div styleName="container">
        <div styleName="top-area">
          <div styleName={this.state.feedback === BATCH_SUCCESS ? 'feedback__success' : 'hide'}>
            <Banner
              vdStyle
            >
              {this.state.batchSuccessText}
            </Banner>
          </div>
        </div>
        <div styleName={this.state.checkedList.length > 0 ? 'pure-row-area__short' : 'pure-row-area'}>
          <CheckboxGroup
            checkedList={this.state.checkedList}
            onChange={this.handleCheckedList}
            name="selectedVideos"
          >
            {
              this.props.users.map(user =>
                <Table
                  key={user.uid}
                  uid={user.uid}
                  account={user.account}
                  tasks={filterTasksStatus.filter(task => task.assignee_id === user.uid)}
                  updateOneTaskPriority={(taskId, priority) => {
                    this.handleFeedback(NORMAL);
                    return this.props.updateOneTaskPriority(taskId, priority)
                      .then(
                        () => { this.feedbackSuccessShow(PRIORITY_SUCCESS_FEEDBACK); },
                      )
                      .catch(() => {
                        this.feedbackFailShow(PRIORITY_FAIL_FEEDBACK);
                      });
                  }}
                  releaseOneTask={(taskId) => {
                    this.handleFeedback(NORMAL);
                    return this.props.releaseOneTask(taskId)
                      .then(() => { this.feedbackSuccessShow(RELEASE_SUCCESS_FEEDBACK); })
                      .catch(() => {
                        this.feedbackFailShow(RELEASE_FAIL_FEEDBACK);
                      });
                  }}
                />
              )
            }
          </CheckboxGroup>
        </div>
        <div styleName={this.state.checkedList.length > 0 ? 'batchOpt' : 'batchOpt__hide'}>
          <BatchOpe
            checkedList={this.state.checkedList}
            clearCheckedList={this.clearCheckedList}
            releaseManyTasks={this.props.releaseManyTasks}
            updateManyTasksPriority={curriedUpdateManyTasksPriority}
            successFeedback={(batchSuccessText) => {
              this.handleFeedback(BATCH_SUCCESS);
              this.handleBatchSuccessText(batchSuccessText);
              setTimeout(
                this.handleFeedback,
                3500,
                NORMAL,
              );
            }}
            failFeedback={(batchFailText) => {
              this.feedbackFailShow(batchFailText);
            }}
            clearFeedbackStatus={() => {
              this.handleFeedback(NORMAL);
            }}
          />
        </div>
        <Modal
          ref={(modal) => { this.modal = modal; }}
          hideWhenBackground
          headerHide
        />
      </div>
    );
  }
}

OneMember.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  tasks: PropTypes.arrayOf(PropTypes.object),
  updateOneTaskPriority: PropTypes.func,
  updateManyTasksPriority: PropTypes.func,
  releaseOneTask: PropTypes.func,
  releaseManyTasks: PropTypes.func,
};

export default CSSModules(OneMember, styles);
