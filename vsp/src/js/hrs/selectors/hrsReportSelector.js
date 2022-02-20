import { NAME } from '../constants';

export const getGroupbyReports = state => state[NAME].hrsReportReducer.groupbyReports;
export const getReports = state => state[NAME].hrsReportReducer.reports;
export const getShifts = state => state[NAME].hrsReportReducer.shifts;
export const getShiftMaps = state => state[NAME].hrsReportReducer.shiftMaps;
export const getCache = state => state[NAME].hrsReportReducer.cache;
