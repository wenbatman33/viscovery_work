import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { describe, it, afterEach } from 'mocha';
import * as campaignApi from './campaignApi';

describe('campaign API tests', () => {
  const BASE_URL = process.env.VDS_HOST;

  describe('get campaigns api', () => {
    it('api data key/value check', () => {
      const url = '/tag2ad/webapi/campaign/v1/campaigns?page=1&number_of_rows_in_page=50&name=';

      const responseObj = {
        campaigns: [
          {
            name: 'Campaign_1',
            number_of_ads: 15000,
            start_time: '2017-07-13T11:07:32.346283',
            campaign_id: 98,
            ad_host: 'Host',
            end_time: '2017-07-13T11:07:32.346284',
          },
        ],
        number_of_total_pages: 1,
      };
      fetchMock.get(`${BASE_URL}${url}`, responseObj);

      const targetPage = 1;
      const onePageCount = 50;
      const searchText = '';
      campaignApi.getCampaigns(targetPage, onePageCount, searchText)
        .then().catch(err => err);

      expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}${url}`);
    });

    afterEach(() => {
      fetchMock.restore();
    });
  });

  describe('add campaign api', () => {
    const url = '/tag2ad/webapi/campaign/v1/campaigns';

    it(`path is ${url}`, () => {
      fetchMock.post(`${BASE_URL}${url}`, {});
      campaignApi.addCampaign({})
        .then().catch(err => err);
      expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}${url}`);
    });

    it('api data key/value check', () => {
      const name = 'campaign';
      const adHost = 'adidas';
      const startTime = '1500538990';
      const endTime = '1500538990';

      fetchMock.post(`${BASE_URL}${url}`, {});

      campaignApi.addCampaign({
        name,
        ad_host: adHost,
        start_time: startTime,
        end_time: endTime,
      })
        .then().catch(err => err);

      const body = JSON.parse(fetchMock.lastOptions().body);

      expect(body.name).to.be.equal(name);
      expect(body.ad_host).to.be.equal(adHost);
      expect(body.start_time).to.be.equal(startTime);
      expect(body.end_time).to.be.equal(endTime);
    });

    afterEach(() => {
      fetchMock.restore();
    });
  });

  describe('patch campaign api', () => {
    const campaignId = 99;
    const url = `/tag2ad/webapi/campaign/v1/campaigns/${campaignId}`;

    it(`path is ${url}`, () => {
      fetchMock.patch(`${BASE_URL}${url}`, {});
      campaignApi.patchCampaign(campaignId, {})
        .then().catch(err => err);
      expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}${url}`);
    });

    it('api data key/value check', () => {
      const name = 'campaign';
      const adHost = 'adidas';
      const startTime = '1500538990';
      const endTime = '1500538990';

      fetchMock.patch(`${BASE_URL}${url}`, {});

      campaignApi.patchCampaign(campaignId, {
        name,
        ad_host: adHost,
        start_time: startTime,
        end_time: endTime,
      })
        .then().catch(err => err);

      const body = JSON.parse(fetchMock.lastOptions().body);

      expect(body.name).to.be.equal(name);
      expect(body.ad_host).to.be.equal(adHost);
      expect(body.start_time).to.be.equal(startTime);
      expect(body.end_time).to.be.equal(endTime);
    });

    afterEach(() => {
      fetchMock.restore();
    });
  });

  describe('put campaign api', () => {
    const campaignId = 99;
    const url = `/tag2ad/webapi/campaign/v1/campaigns/${campaignId}`;

    it(`path is ${url}`, () => {
      fetchMock.put(`${BASE_URL}${url}`, {});
      campaignApi.duplicateCampaign(campaignId)
        .then().catch(err => err);
      expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}${url}`);
    });

    afterEach(() => {
      fetchMock.restore();
    });
  });

  describe('erase campaign api', () => {
    const campaignId = 99;
    const url = `/tag2ad/webapi/campaign/v1/campaigns/${campaignId}`;

    it(`path is ${url}`, () => {
      fetchMock.delete(`${BASE_URL}${url}`, {});
      campaignApi.deleteCampaign(campaignId)
        .then().catch(err => err);
      expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}${url}`);
    });

    afterEach(() => {
      fetchMock.restore();
    });
  });
});
