import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { describe, it, afterEach } from 'mocha';
import * as adsApi from './adsApi';

describe('ads API tests', () => {
  const BASE_URL = process.env.VDS_HOST;

  describe('export ad api', () => {
    const url = '/tag2ad/webapi/vsp/ads/v1/export';

    it(`path is ${url}`, () => {
      fetchMock.post(`${BASE_URL}${url}`, {});
      adsApi.exportAds(0)
        .then().catch(err => err);
      expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}${url}`);
    });

    it('api data key/value check', () => {
      const campaignId = 0;
      const all = true;
      const filterIDs = ['58ff2cebf9f4d323a7670489', '58ff2cebf9f4d323a76704df'];
      const startTime = new Date('2015/05/01 12:00:00');
      const endTime = new Date('2015/05/12 13:00:00');
      const adIDs = ['123', '456'];

      fetchMock.post(`${BASE_URL}${url}`, {});

      adsApi.exportAds(campaignId, all, adIDs, filterIDs, startTime, endTime)
        .then().catch(err => err);

      expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}${url}`);

      const body = fetchMock.lastOptions().body;

      expect(body).to.be.an.instanceof(FormData);
      expect(body.get('all')).to.be.equal('1');
      expect(body.get('campaign_id')).to.be.equal(String(campaignId));
      expect(body.get('filter_ids')).to.be.equal(JSON.stringify(filterIDs));
      expect(body.get('start_time')).to.be.equal('2015-05-01');
      expect(body.get('end_time')).to.be.equal('2015-05-12');
      expect(body.get('ad_ids')).to.be.equal(JSON.stringify(adIDs));
    });

    afterEach(() => {
      fetchMock.restore();
    });
  });

  describe('download ad api', () => {
    const url = '/tag2ad/webapi/vsp/ads/v1/download';

    it(`path is ${url}`, () => {
      fetchMock.post(`${BASE_URL}${url}`, {});
      adsApi.downloadAds(0)
        .then().catch(err => err);
      expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}${url}`);
    });

    it('api data key/value check', () => {
      const campaignId = 0;
      const all = true;
      const filterIDs = ['58ff2cebf9f4d323a7670489', '58ff2cebf9f4d323a76704df'];
      const startTime = new Date('2015/05/01 12:00:00');
      const endTime = new Date('2015/05/12 13:00:00');
      const adIDs = ['123', '456'];

      fetchMock.post(`${BASE_URL}${url}`, {});

      adsApi.downloadAds(campaignId, all, adIDs, filterIDs, startTime, endTime)
        .then().catch(err => err);

      const body = fetchMock.lastOptions().body;

      expect(body).to.be.an.instanceof(FormData);
      expect(body.get('all')).to.be.equal('1');
      expect(body.get('campaign_id')).to.be.equal(String(campaignId));
      expect(body.get('filter_ids')).to.be.equal(JSON.stringify(filterIDs));
      expect(body.get('start_time')).to.be.equal('2015-05-01');
      expect(body.get('end_time')).to.be.equal('2015-05-12');
      expect(body.get('ad_ids')).to.be.equal(JSON.stringify(adIDs));
    });

    afterEach(() => {
      fetchMock.restore();
    });
  });

  describe('create ad api', () => {
    const url = '/tag2ad/webapi/ads/v1/ad';

    it(`path is ${url}`, () => {
      fetchMock.post(`${BASE_URL}${url}`, {});
      adsApi.createWithSearchResult(0, '123', 5)
        .then().catch(err => err);
      expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}${url}`);
    });

    it('create with search result, data format and key/value check', () => {
      const campaignId = 0;
      const filterIDs = ['58ff2cebf9f4d323a7670489', '58ff2cebf9f4d323a76704df'];
      const adFilterId = 'f93jau9';
      const adFormId = 10;
      const filterContent = {
        time_space_percent: {
          e: 0,
          s: 0,
        },
      };
      const videoMap = { 9: [1, 2] };
      const expectBody = {
        ad_filter_id: adFilterId,
        ad_form_id: adFormId,
        ad_campaign_id: campaignId,
        filter_content: filterContent,
        video_map: videoMap,
        filter_ids: filterIDs,
      };

      fetchMock.post(`${BASE_URL}${url}`, {});

      adsApi.createWithSearchResult(
        campaignId, adFilterId, adFormId, filterContent, videoMap, filterIDs)
        .then().catch(err => err);


      const headers = fetchMock.lastOptions().headers;
      expect(headers['Content-Type']).to.be.equal('application/json');

      expect(fetchMock.lastOptions().body).to.be.a('string');

      const body = JSON.parse(fetchMock.lastOptions().body);
      expect(body).to.be.deep.equal(expectBody);
    });

    afterEach(() => {
      fetchMock.restore();
    });
  });
});
