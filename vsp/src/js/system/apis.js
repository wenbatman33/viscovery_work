import { bindQueryString } from 'utils/urlUtil';
import { ApiUtil } from '../utils';

export const queryRecognitionTasks = (
  priority, offset, limit, groupName, seriesName, videoName, account, cleancache
  ) =>
  ApiUtil.get(
    bindQueryString('/api/recognitions/tasks')(
      {
        priority,
        offset,
        limit,
        groupName,
        seriesName,
        videoName,
        account,
        cleancache,
      }
    )
);

const endpoint = '/api/recognitions/tasks';
export const queryAdjustRecognitionTasks = (payload) => {
  const data = new FormData();
  data.append('src_priority', payload.src_priority);
  data.append('dst_priority', payload.dst_priority);
  data.append('model_job_ids', payload.model_job_ids);
  return ApiUtil.post(endpoint, data);
};
