import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getMessage,
  getResponseCode,
  getTasks,
  getTasksTotalCount,
  getUpdateTime,
  getTasksFilterCount,
  getFailureTasks,
  getSuccessCount,
  getFailureCount,
} from '../selectors';
import { requestRecognitionTasks, requestAdjustRecognitionTasks } from '../actions';
import RecognitionTasks from '../components/RecognitionTasks';
import PriorityList from '../components/RecognitionTasks/PriorityList';

const mapStateToProps = createStructuredSelector({
  message: getMessage,
  response_code: getResponseCode,
  tasks: getTasks,
  update_time: getUpdateTime,
  tasks_total_count: getTasksTotalCount,
  tasks_filter_count: getTasksFilterCount,
  failure_tasks: getFailureTasks,
  success_count: getSuccessCount,
  failure_count: getFailureCount,
});


const mapDispatchToProps = dispatch => ({
  getRecognitionTasks: (params) => {
    const action = requestRecognitionTasks(params);
    return dispatch(action);
  },
  adjustRecognitionTasks: (params) => {
    const action = requestAdjustRecognitionTasks(params);
    return dispatch(action);
  },
});

const GetRecognitionTasks = connect(
  mapStateToProps,
  mapDispatchToProps
)(RecognitionTasks, PriorityList);

export default GetRecognitionTasks;
