import {
  ApiUtil,
} from 'utils';

import {
  bindQueryString,
} from 'utils/urlUtil';

const endpoint = '/api/hrs/reports';

export const getReportsApi = (since, to, groupby = 0, lang, userId) =>
  ApiUtil.get(
    bindQueryString(endpoint)(
      {
        since,
        to,
        groupby,
        lang,
        user_id: userId,
      }
    )
  );
