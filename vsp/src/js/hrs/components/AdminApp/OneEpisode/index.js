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
import { translateTask } from '../utils';

import styles from './OneEpisode.scss';

export const ALL = 'all';
export const FACE = 1;
export const OBJECT = 6;
export const SCENE = 7;

const NORMAL = 0;
const BATCH_SUCCESS = 'BATCH_SUCCESS';

const options = [
  {
    value: ALL,
    label: 'All',
  },
  {
    value: FACE,
    label: 'Face',
  },
  {
    value: OBJECT,
    label: 'Object',
  },
  {
    value: SCENE,
    label: 'Scene',
  },
];

const filterTasksFunc = filter => task =>
  (filter === ALL ? true : task.model_id === filter);

class OneEpisode extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleFilter = this.handleFilter.bind(this);
    this.clearCheckedList = this.clearCheckedList.bind(this);
    this.handleCheckedList = this.handleCheckedList.bind(this);
    this.handleFeedback = this.handleFeedback.bind(this);
    this.feedbackFailShow = this.feedbackFailShow.bind(this);
    this.feedbackSuccessShow = this.feedbackSuccessShow.bind(this);

    this.state = {
      filter: ALL,
      checkedList: [],
      feedback: NORMAL,
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

  feedbackFailShow() {
    this.modal.toShow();
    this.modal.switchContent(
      <FailFeedbackContent
        text="有的工作已開始進行，無法完成分配，請重新進行分配"
        toExit={this.modal.toHide}
      />
    );
  }

  feedbackSuccessShow() {
    this.handleFeedback(BATCH_SUCCESS);
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
    const filteredTasks = this.props.tasks.filter(filterTasksFunc(this.state.filter));
    const translatedTasks =
            filteredTasks.map(translateTask(this.props.brandsFromStructure, this.props.lang));
    const groupByModelId = R.groupBy(task => task.model_id);
    const groupedTasks = groupByModelId(translatedTasks);
    const updateOneTaskAssignee = (taskId, assignerId, assigneeId) => {
      this.handleFeedback(NORMAL);
      return this.props.updateOneTaskAssignee(taskId, assignerId, assigneeId)
        .then(this.feedbackSuccessShow)
        .catch(() => {
          this.feedbackFailShow();
        });
    };
    const curriedUpdateOneTaskAssignee = R.curry(updateOneTaskAssignee);
    const curriedUpdateManyTasksAssignee = R.curry(this.props.updateManyTasksAssignee);

    return (
      <div styleName="container">
        <div styleName="top-area">
          <div styleName={this.state.feedback === BATCH_SUCCESS ? 'feedback__success' : 'hide'}>
            <Banner
              vdStyle
            >
              工作已重新分配
            </Banner>
          </div>
          <div styleName="normal-top">
            <div styleName="videoName">
              <h3>{ this.props.videoName }</h3>
            </div>
            <div styleName="buttonGroup">
              <ButtonGroup
                onChange={this.handleFilter}
                value={this.state.filter}
                options={options.map(option => (
                  {
                    ...option,
                    label: `${option.label} ${this.props.tasks.filter(filterTasksFunc(option.value)).length}`,
                  }
                ))}
              />
            </div>
          </div>
        </div>
        <div styleName={this.state.checkedList.length > 0 ? 'table__short' : 'table'}>
          <CheckboxGroup
            checkedList={this.state.checkedList}
            onChange={this.handleCheckedList}
          >
            {
              Object.keys(groupedTasks).map(modelId =>
                <Table
                  key={modelId}
                  modelId={modelId}
                  tasks={groupedTasks[modelId]}
                  users={this.props.users}
                  updateOneTaskAssignee={curriedUpdateOneTaskAssignee(
                    R.__,
                    this.props.userId,
                    R.__)}
                />
              )
            }
          </CheckboxGroup>
        </div>
        <div styleName={this.state.checkedList.length > 0 ? 'batchOpt' : 'batchOpt__hide'}>
          <BatchOpe
            checkedList={this.state.checkedList}
            clearCheckedList={this.clearCheckedList}
            updateManyTasksAssignee={curriedUpdateManyTasksAssignee(R.__, this.props.userId, R.__)}
            successFeedback={this.feedbackSuccessShow}
            failFeedback={() => {
              this.feedbackFailShow();
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

OneEpisode.propTypes = {
  videoName: PropTypes.string,
  tasks: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
  userId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  updateOneTaskAssignee: PropTypes.func,
  updateManyTasksAssignee: PropTypes.func,
  getData: PropTypes.func,
  brandsFromStructure: PropTypes.object,
  lang: PropTypes.string,
};

export default CSSModules(OneEpisode, styles);
