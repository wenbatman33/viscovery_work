import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import style from './style.scss';

class TasksFuncBar extends React.Component {
  showTasksAdjustConfirm = () => {
    this.props.showTasksAdjustConfirm();
  }

  render() {
    return (
      <div styleName="TasksFuncBar">
        <div styleName="TasksStatus">
          <span styleName="selectTasks">
            {this.props.AdjustModelIDArray.length}
          </span>
          <span styleName="status"> 個任務已選擇</span>
        </div>
        <div styleName="TasksSender">
          <button styleName="button" onClick={() => this.showTasksAdjustConfirm()}>調整優先權</button>
        </div>
      </div>
    );
  }
}

TasksFuncBar.propTypes = {
  showTasksAdjustConfirm: PropTypes.func,
  AdjustModelIDArray: PropTypes.array,
};

export default CSSModules(TasksFuncBar, style);
