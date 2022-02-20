import { NAME } from '../constants';
import { selector as sharedSelector } from '../../shared';

export const getTaskId = state => state[NAME].hrsJobReducer.taskId;
export const getProcessId = state => state[NAME].hrsJobReducer.processId;
export const getImageHost = sharedSelector.getImgHost;
