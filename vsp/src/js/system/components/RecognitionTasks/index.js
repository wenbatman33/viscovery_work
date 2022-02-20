import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import moment from 'moment';
import PriorityList from './PriorityList';
import TasksFuncBar from './TasksFuncBar';
import TasksAdjustConfirm from './TasksAdjustConfirm';
import Rows from './Rows';
import { Button } from './../../../core/components/Button';
import { Modal } from './../../../core/components/Dialogs';
import style from './style.scss';

const transferTime = (timeStr) => {
  const processedStr = timeStr.split('.')[0];
  const mometobj = moment(processedStr);
  const date = moment(processedStr).utc().format('YYYY-MM-DD HH:mm:ss');
  const stillUtc = moment(processedStr).utc(date).toDate();
  const local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
  return mometobj.isValid() ? local : '';
};

const initialApiParams = {
  priority: 'E',
  offset: 0,
  limit: 10,
  group_name: '',
  series_name: '',
  video_name: '',
  account: '',
  cleancache: 0,
};

class RecognitionTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getApiParams: initialApiParams,
      allLevel: ['A', 'B', 'C', 'D', 'E'],
      TasksAdjustConfirmVisiable: false,
      allSelect: false,
      AdjustModelIDArray: [],
      src_priority: '',
      dst_priority: '',
    };
  }
  componentDidMount() {
    this.getAPI();
  }

  getAPI = (isCleanAdjustModelIDArray = false) => {
    this.setState({ getApiParams: initialApiParams, TasksAdjustConfirmVisiable: false });
    if (!isCleanAdjustModelIDArray) this.setState({ AdjustModelIDArray: [], allSelect: false });
    this.props.getRecognitionTasks(this.state.getApiParams);
    initialApiParams.cleancache = 0;
  }

  showResult(res) {
    const contentA = (
      <div>
        <h4>調整優先及結果</h4>
        <p>成功: {res.success_count} 筆</p>
        <p>失敗: {res.failure_count} 筆</p>
        <div>
          <Button vdStyle="primary" vdSize="normal" onClick={() => { this.modal.toHide(); }}>
            關閉
          </Button>
        </div>
      </div>
    );
    this.modal.switchContent(contentA);
    this.modal.toShow();
    this.handleCleanCache();
  }

  adjustConfirm= (dstPriority) => {
    const tempLevel = {
      src_priority: this.state.getApiParams.priority,
      dst_priority: dstPriority,
      model_job_ids: this.state.AdjustModelIDArray,
    };
    this.props.adjustRecognitionTasks(tempLevel)
      .then(res => this.showResult(res));
  }
  changePriorityLevel = (priority) => {
    initialApiParams.priority = priority;
    this.cleanField();
    this.getAPI();
  }
  prevPageClick = () => {
    initialApiParams.cleancache = 0;
    if (initialApiParams.offset > 0) {
      initialApiParams.offset -= 10;
      this.getAPI(true);
    }
  }
  nextPageClick = () => {
    initialApiParams.cleancache = 0;
    if ((initialApiParams.offset + 10) < this.props.tasks_filter_count) {
      initialApiParams.offset += 10;
      this.getAPI(true);
    }
  }
  handleCleanCache() {
    initialApiParams.cleancache = 1;
    initialApiParams.offset = 0;
    this.getAPI();
  }

  seriesNameChange = (e) => {
    initialApiParams.series_name = e.target.value;
  }
  videoNameChange = (e) => {
    initialApiParams.video_name = e.target.value;
  }
  groupNameChange = (e) => {
    initialApiParams.group_name = e.target.value;
  }
  accountChange = (e) => {
    initialApiParams.account = e.target.value;
  }
  tasksFilter = () => {
    initialApiParams.offset = 0;
    this.getAPI();
  }
  cleanField = () => {
    initialApiParams.series_name = '';
    initialApiParams.video_name = '';
    initialApiParams.group_name = '';
    initialApiParams.account = '';
    initialApiParams.offset = 0;
    document.getElementById('series_name').value = '';
    document.getElementById('video_name').value = '';
    document.getElementById('group_name').value = '';
    document.getElementById('account').value = '';
  }
  cleanFilter = () => {
    this.cleanField();
    this.getAPI();
  }

  selectModelJobId = (ID) => {
    const tempArray = this.state.AdjustModelIDArray.slice();
    const isInArray = tempArray.indexOf(ID);
    if (isInArray < 0) {
      tempArray.push(ID);
    } else {
      tempArray.splice(isInArray, 1);
    }
    this.setState({ AdjustModelIDArray: tempArray });
  }
  handleSelectAll = () => {
    const tempArray = [];
    if (!this.state.allSelect) {
      for (let index = 0; index < this.props.tasks.length; index += 1) {
        tempArray[index] = this.props.tasks[index].model_job_id;
      }
      this.setState({ AdjustModelIDArray: tempArray, allSelect: !this.state.allSelect });
    } else {
      this.setState({ AdjustModelIDArray: [], allSelect: !this.state.allSelect });
    }
  }
  showTasksAdjustConfirm = () => {
    this.setState({ TasksAdjustConfirmVisiable: !this.state.TasksAdjustConfirmVisiable });
  }
  render() {
    return (
      <div styleName="main">
        <PriorityList
          allLevel={this.state.allLevel}
          priority={this.state.getApiParams.priority}
          handleClick={priority => this.changePriorityLevel(priority)}
        />
        <div styleName="contentWapper">
          <div styleName="PriorityStatus">
            <div styleName="status">
              <div styleName="status_panelR">
                <span styleName="Title">優先級別 { this.state.getApiParams.priority}</span>
                <span styleName="Time">列表上次更新於: {transferTime(this.props.update_time)}</span>
                <div styleName="tooltip" onClick={() => this.handleCleanCache()}>
                  重新整理{'  '}
                  <i className="fa fa-exclamation-circle" aria-hidden="true" />
                  <span styleName="tooltiptext">取得待辨識任務列表有一定風險會造成系統卡頓，請勿過於頻繁執行此按鈕 </span>
                </div>
              </div>
              <div styleName="status_panelL">
                <span styleName="Pages">
                  共 {this.props.tasks_filter_count } 筆
                  {this.props.tasks_filter_count > 0 ? `，第 ${this.state.getApiParams.offset + 1} 到 ${this.state.getApiParams.offset + 10} 筆` : null}
                  <button styleName="button" onClick={() => this.prevPageClick()}><i className="fa fa-angle-left" aria-hidden="true" /></button>
                  <button styleName="button" onClick={() => this.nextPageClick()}><i className="fa fa-angle-right" aria-hidden="true" /></button>
                </span>
              </div>
            </div>
            <div styleName="filterTool">
              <input type="text" id="series_name" onChange={this.seriesNameChange} placeholder="資料夾" />
              <input type="text" id="video_name" onChange={this.videoNameChange} placeholder="影片名稱" />
              <input type="text" id="group_name" onChange={this.groupNameChange} placeholder="群組" />
              <input type="text" id="account" onChange={this.accountChange} placeholder="帳號" />
              <button styleName="btn__default" onClick={() => this.cleanFilter()}>清除所有條件</button>
              <button styleName="button" onClick={() => this.tasksFilter()}>搜尋任務</button>
            </div>
          </div>
          <div styleName="Tasks">
            <table>
              <thead>
                <tr>
                  <th styleName="center">
                    <input type="checkbox" name="" checked={this.state.allSelect} onChange={this.handleSelectAll} />
                  </th>
                  <th>順序</th>
                  <th>資料夾名稱</th>
                  <th>影片名稱</th>
                  <th>辨識模組</th>
                  <th>群組</th>
                  <th>帳號</th>
                  <th>上傳時間</th>
                </tr>
              </thead>
              <tbody>
                {this.props.tasks.map(series => (
                  <Rows
                    key={series.model_job_id}
                    model_job_id={series.model_job_id}
                    priority={series.priority}
                    group_name={series.group_name}
                    account={series.account}
                    series_name={series.series_name}
                    video_name={series.video_name}
                    model_id={series.model_id}
                    enqueue_time={transferTime(series.enqueue_time)}
                    selectModel_job_id={this.selectModelJobId}
                    allSelect={this.state.allSelect}
                    checked={(this.state.AdjustModelIDArray.indexOf(series.model_job_id) > -1)}
                  />
                  ))
                }
              </tbody>
            </table>
          </div>
          {(this.state.AdjustModelIDArray.length > 0) ?
            <TasksFuncBar
              AdjustModelIDArray={this.state.AdjustModelIDArray}
              showTasksAdjustConfirm={this.showTasksAdjustConfirm}
            />
            :
              null
          }
          { this.state.TasksAdjustConfirmVisiable ?
            <TasksAdjustConfirm
              allLevel={this.state.allLevel}
              priority={this.state.getApiParams.priority}
              dst_priority=""
              adjustConfirm={this.adjustConfirm}
              showTasksAdjustConfirm={this.showTasksAdjustConfirm}
            />
            :
              null
          }
        </div>
        <Modal ref={(node) => { this.modal = node; }} />
      </div>
    );
  }
}
RecognitionTasks.propTypes = {
  getRecognitionTasks: PropTypes.func,
  tasks: PropTypes.array,
  tasks_filter_count: PropTypes.number,
  update_time: PropTypes.string,
  adjustRecognitionTasks: PropTypes.func,
};

export default CSSModules(RecognitionTasks, style);
