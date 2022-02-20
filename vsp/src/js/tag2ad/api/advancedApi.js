import { bindQueryString } from 'utils/urlUtil';

import { ApiUtil } from 'utils';

const endpoint = '/tag2ad/webapi/proxy/v1/vsp/advanced';
// const jsonHeaders = {
//   'Content-Type': 'application/json',
// };

export const getAdvancedOptionsApi = lang =>
  ApiUtil.get(
    bindQueryString(`${endpoint}/config`)({
      lang,
    })
  );
