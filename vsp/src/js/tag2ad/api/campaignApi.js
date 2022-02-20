import { bindQueryString } from 'utils/urlUtil';

import { ApiUtil } from 'utils';

const endpoint = '/tag2ad/webapi/campaign/v1';
const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const getCampaign = id => ApiUtil.get(`${endpoint}/campaigns/${id}`);

export const getAllCampaignBrief = () =>
  ApiUtil.get(`${endpoint}/brief_campaigns`);

export const getCampaigns = (targetPage, pageCount, searchText) =>
  ApiUtil.get(
    bindQueryString(`${endpoint}/campaigns`)({
      page: targetPage,
      number_of_rows_in_page: pageCount,
      name: searchText,
    })
  );

export const checkCampaignName = (name) => {
  const payload = {
    all: true,
  };

  if (name) {
    payload.name = name;
  }

  return ApiUtil.get(
    bindQueryString(`${endpoint}/campaigns`)(payload)
  );
};

export const getAdHost = (name) => {
  const payload = {};

  if (name) {
    payload.name = name;
  }

  return ApiUtil.get(
    bindQueryString(`${endpoint}/ad_hosts`)(payload)
  );
};

export const addCampaign = data =>
  ApiUtil.post(`${endpoint}/campaigns`, JSON.stringify(data), jsonHeaders);

export const patchCampaign = (campaignId, data) =>
  ApiUtil.patch(`${endpoint}/campaigns/${campaignId}`, JSON.stringify(data), jsonHeaders);

export const duplicateCampaign = campaignId =>
  ApiUtil.put(`${endpoint}/campaigns/${campaignId}`, {}, jsonHeaders);

export const deleteCampaign = campaignId =>
  ApiUtil.erase(`${endpoint}/campaigns/${campaignId}`, {});
