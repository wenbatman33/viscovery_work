import { ApiUtil } from '../../utils';

const endpoint = '/api/config';

export const getResourceConfig = () => (
  ApiUtil.get(endpoint)
);
