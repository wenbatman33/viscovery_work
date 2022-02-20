import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Episode from '../../components/AdminApp/Episode';

import {
  getAdminVideos,
  getAdminTasks,
} from '../../selectors/hrsAdminSelector';

import {
  updateOneVideoPriority,
  updateManyVideosPriority,
} from '../../actions';

const mapStateToProps = createStructuredSelector({
  videos: getAdminVideos,
  tasks: getAdminTasks,
});

const mapDispatchToProps = dispatch => ({
  updateOneVideoPriority: (videoId, priority) =>
    dispatch(updateOneVideoPriority(videoId, priority)),
  updateManyVideosPriority: (videoIds, priority) =>
    dispatch(updateManyVideosPriority(videoIds, priority)),
});

const EpisodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Episode);

export default EpisodeContainer;
