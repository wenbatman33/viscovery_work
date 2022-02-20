import sinon from 'sinon';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';
import ApiUtil from '../ApiUtil';


describe('ApiUtil testing', () => {
  const BASE_URL = process.env.VDS_HOST;
  const fakeToken = 'aabbccdd';
  const fakeUser = 'the fake user';
  // const fakeRespond = { hello: 'world' };

  ApiUtil.token = fakeToken;
  ApiUtil.account = fakeUser;

  it('api get with url/header', () => {
    fetchMock.get(`${BASE_URL}/foo`, {});

    ApiUtil.get('/foo').then().catch(err => err);
    expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}/foo`);
    expect(fetchMock.lastOptions().headers.Authorization).to.equal(`Bearer ${fakeToken}`);
    expect(fetchMock.lastOptions().headers.VdsUser).to.equal('the fake user');

    fetchMock.restore();
  });
  it('api post with url/extraHeader/body', () => {
    const postData = { data: 'postToDb' };
    const extraHeader = { extra: 'extraValue' };
    fetchMock.post(`${BASE_URL}/foo`, {});

    ApiUtil.post('/foo', postData, extraHeader).then().catch(err => err);
    expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}/foo`);
    expect(fetchMock.lastOptions().headers.extra).to.equal('extraValue');
    expect(fetchMock.lastOptions().body).to.deep.equal(postData);

    fetchMock.restore();
  });
  it('api patch with url/body', () => {
    const patchData = { data: 'patchToDb' };
    fetchMock.patch(`${BASE_URL}/foo`, {});

    ApiUtil.patch('/foo', patchData).then().catch(err => err);
    expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}/foo`);
    expect(fetchMock.lastOptions().body).to.deep.equal(patchData);

    fetchMock.restore();
  });
  it('api erase with url/body', () => {
    const deleteData = { data: 'deleteFromDb' };
    fetchMock.delete(`${BASE_URL}/foo`, {});

    ApiUtil.erase('/foo', deleteData).then().catch(err => err);
    expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}/foo`);
    expect(fetchMock.lastOptions().body).to.deep.equal(deleteData);

    fetchMock.restore();
  });
  it('trigger 401 handler', () => {
    const cb401 = () => {};
    const cbSpy = sinon.spy(cb401);

    ApiUtil.reg401handler(cbSpy);

    fetchMock.get(`${BASE_URL}/bar`, { status: 401 });

    ApiUtil.get('/bar').then(() => {},
      () => {
        sinon.assert.calledOnce(cbSpy);
      });
    expect(fetchMock.lastUrl()).to.equal(`${BASE_URL}/bar`);
    cbSpy.reset();
    fetchMock.restore();
  });
});
