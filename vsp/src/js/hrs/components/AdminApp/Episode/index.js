import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import { ButtonGroup } from 'vidya/Button';
import { Banner } from 'vidya/Feedback';
import Modal from 'vidya/Dialogs/Modal';

import Table from './Table';
import BatchOpe from './BatchOpe';
import FailFeedbackContent from '../common/FailFeedbackContent';

import styles from './Episode.scss';

export const WAITING = 1;
export const PROCESSING = 2;

const NORMAL = 0;
const BATCH_SUCCESS = 'BATCH_SUCCESS';

const options = [
  {
    value: WAITING,
    label: '等待中',
  },
  {
    value: PROCESSING,
    label: '進行中',
  },
];

const filterVideosFunc = filter => video =>
  video.hrs_status === filter;

class Episode extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleFilter = this.handleFilter.bind(this);
    this.clearCheckedList = this.clearCheckedList.bind(this);
    this.handleCheckedList = this.handleCheckedList.bind(this);
    this.handleFeedback = this.handleFeedback.bind(this);
    this.feedbackFailShow = this.feedbackFailShow.bind(this);
    this.feedbackSuccessShow = this.feedbackSuccessShow.bind(this);

    this.state = {
      filter: WAITING,
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
        text="有的工作已開始進行，無法調整優先權，請重新進行操作"
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
    const filteredVideos = this.props.videos.filter(filterVideosFunc(this.state.filter));
    const curriedUpdateManyVideosPriority = R.curry(this.props.updateManyVideosPriority);

    return (
      <div styleName="container">
        <div styleName="top-area">
          <div styleName={this.state.feedback === BATCH_SUCCESS ? 'feedback__success' : 'hide'}>
            <Banner
              vdStyle
            >
              優先權調整成功
            </Banner>
          </div>
          <div styleName="buttonGroup">
            <ButtonGroup
              onChange={this.handleFilter}
              value={this.state.filter}
              options={options.map(option => (
                {
                  ...option,
                  label: `${option.label} ${this.props.videos.filter(filterVideosFunc(option.value)).length}`,
                }
              ))}
            />
          </div>
        </div>
        <Table
          videos={filteredVideos}
          tasks={this.props.tasks}
          updateOneVideoPriority={(videoId, priority) => {
            this.handleFeedback(NORMAL);
            return this.props.updateOneVideoPriority(videoId, priority)
              .then(this.feedbackSuccessShow)
              .catch(this.feedbackFailShow);
          }}
          filter={this.state.filter}
          checkedList={this.state.checkedList}
          checkedListOnChange={this.handleCheckedList}
        />
        <div styleName={this.state.checkedList.length > 0 ? 'batchOpt' : 'batchOpt__hide'}>
          <BatchOpe
            checkedList={this.state.checkedList}
            clearCheckedList={this.clearCheckedList}
            updateManyVideosPriority={curriedUpdateManyVideosPriority}
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

Episode.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.object),
  tasks: PropTypes.arrayOf(PropTypes.object),
  updateOneVideoPriority: PropTypes.func,
  updateManyVideosPriority: PropTypes.func,
  getData: PropTypes.func,
};

export default CSSModules(Episode, styles);
