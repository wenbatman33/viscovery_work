import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import { CheckboxGroup } from 'react-checkbox-duet';

import { ButtonGroup } from 'vidya/Button';
import { Banner } from 'vidya/Feedback';
import Modal from 'vidya/Dialogs/Modal';

import Table from './Table';
import BatchOpe from './BatchOpe';
import FailFeedbackContent from '../common/FailFeedbackContent';

import { isHrsDisptach } from '../../../utils';
import { translateTask } from '../utils';

import styles from './Member.scss';

const ONLINE = 1;
const OFFLINE = 0;

const NORMAL = 0;
const BATCH_SUCCESS = 'BATCH_SUCCESS';

export const RELEASE_SUCCESS_FEEDBACK = '工作已釋出';
export const RELEASE_FAIL_FEEDBACK = '工作已開始進行，無法釋出';
export const PRIORITY_SUCCESS_FEEDBACK = '優先權調整成功';
export const PRIORITY_FAIL_FEEDBACK = '工作已開始進行，無法調整優先權，請重新操作';

const options = [
  {
    value: ONLINE,
    label: '上線中',
  },
  {
    value: OFFLINE,
    label: '離線',
  },
];

const filterUsersFunc = filter => user =>
  isHrsDisptach(user) && user.isLogin === filter;

class Member extends React.PureComponent {
  constructor(props) {
    super(props);

    this.clearCheckedList = this.clearCheckedList.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleCheckedList = this.handleCheckedList.bind(this);
    this.handleFeedback = this.handleFeedback.bind(this);
    this.feedbackFailShow = this.feedbackFailShow.bind(this);
    this.feedbackSuccessShow = this.feedbackSuccessShow.bind(this);
    this.handleBatchSuccessText = this.handleBatchSuccessText.bind(this);

    this.state = {
      filter: ONLINE,
      checkedList: [],
      feedback: NORMAL,
      batchSuccessText: '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filter !== this.state.filter) {
      this.clearCheckedList();
    }
  }

  handleFilter(filter) {
    this.props.getData();
    this.setState({
      filter: filter.value,
    });
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
    const HrsMembers = this.props.users.map(user => ({
      ...user,
      isLogin: this.props.onlineUserIds.includes(user.uid) ? 1 : 0,
    }));
    const filteredUsers = HrsMembers.filter(filterUsersFunc(this.state.filter));
    const filterTasksStatus = this.props.tasks.filter(task => [0, 1, 2].includes(task.status));
    const transLatedTasks =
            filterTasksStatus.map(translateTask(this.props.brandsFromStructure, this.props.lang));
    const bindedUsers = filteredUsers.map(user => ({
      ...user,
      tasks: transLatedTasks.filter(task => task.assignee_id === user.uid),
    }));
    const sortUserFunc = R.sortWith([
      R.ascend(user => (user.tasks.length > 0 ? 0 : 1)),
      R.ascend(user => user.account.toUpperCase()),
    ]);
    const sortedUsers = sortUserFunc(bindedUsers);
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
          <div styleName="buttonGroup">
            <ButtonGroup
              onChange={this.handleFilter}
              value={this.state.filter}
              options={options.map(option => (
                {
                  ...option,
                  label: `${option.label} ${HrsMembers.filter(filterUsersFunc(option.value)).length}`,
                }
              ))}
            />
          </div>
        </div>
        <div styleName={this.state.checkedList.length > 0 ? 'pure-row-area__short' : 'pure-row-area'}>
          <CheckboxGroup
            checkedList={this.state.checkedList}
            onChange={this.handleCheckedList}
            name="selectedVideos"
          >
            {
              sortedUsers.map(user =>
                <Table
                  key={user.uid}
                  uid={user.uid}
                  account={user.account}
                  tasks={user.tasks}
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
            successFeedback={this.feedbackSuccessShow}
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
Member.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  tasks: PropTypes.arrayOf(PropTypes.object),
  updateOneTaskPriority: PropTypes.func,
  updateManyTasksPriority: PropTypes.func,
  releaseOneTask: PropTypes.func,
  releaseManyTasks: PropTypes.func,
  getData: PropTypes.func,
  onlineUserIds: PropTypes.arrayOf(PropTypes.number),
  brandsFromStructure: PropTypes.object,
  lang: PropTypes.string,
};

export default CSSModules(Member, styles);
