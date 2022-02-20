/**
 * Created by Amdis on 2016/10/13.
 */

export Ad from './Ad';
export AdForm from './AdForm';
export AdCategory from './AdCategory';
export Filter from './Filter';
export Criterion from './Criterion';
export Series from './Series';

export const filterRecognizedSeries =
  series => series.filter(element => element.summary.recognized);
export const filterSeriesWithHrs = series => series.filter(element => element.summary.hrs_done);
export const filterSeriesWithoutHrs =
  series => series.filter(element => element.summary.hrs_undone);
export const filterRecognizedVideos = videos => videos.filter(element => element.is_ready);
export const filterVideosWithHrs = videos => videos.filter(element => element.hrs_done);
export const filterVideosWithoutHrs =
  videos => videos.filter(element => !element.hrs_done);
export const countVideos =
  series => series.map(element => element.summary.total).reduce((x, y) => x + y, 0);
export const countRecognizedVideos =
  series => series.map(element => element.summary.recognized).reduce((x, y) => x + y, 0);
export const countVideosWithHrs =
  series => series.map(element => element.summary.hrs_done).reduce((x, y) => x + y, 0);
export const countVideosWithoutHrs =
  series => series.map(element => element.summary.hrs_undone).reduce((x, y) => x + y, 0);
