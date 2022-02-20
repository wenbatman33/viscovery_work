import { expect } from 'chai';
import fetchMock from 'fetch-mock';

import routerUtil, {
  storeTokenToApiUtil,
  checkIsLogin,
  ifNeedLogin,
  permissionCheck,
  composeChecks,
} from '../routerUtil';

import cookieUtil from '../cookieUtil';
import ApiUtil from '../ApiUtil';

describe('routerUtil testing', () => {
  it('change url by push history', () => {
    const fooPath = '/foo';
    routerUtil.pushHistory(fooPath);
    expect(window.location.hash).to.equal(`#${fooPath}`);
  });
  it('store token and account in ApiUtil', () => {
    const testToken = 'yourFakeToken';
    const testAccount = 'vis_test';
    const testPerissions = ['cms', 'hrs/admin'];

    cookieUtil.saveToken(testToken);
    cookieUtil.saveAccount(testAccount);
    cookieUtil.savePermission(testPerissions);

    storeTokenToApiUtil();

    fetchMock.get('*', {});

    ApiUtil.get('/foo').then().catch(err => err);

    expect(fetchMock.lastOptions().headers.Authorization).to.equal(`Bearer ${testToken}`);
    expect(fetchMock.lastOptions().headers.VdsUser).to.equal(testAccount);
    fetchMock.restore();
  });
  it('remove token and permission from cookie if none', () => {
    const testPerissions = [];
    cookieUtil.savePermission(testPerissions);

    storeTokenToApiUtil();

    expect(cookieUtil.getPermission()).to.deep.equal(null);
    expect(cookieUtil.isTokenExisted()).to.equal(false);
  });
  it('redirect to signin if no token', () => {
    routerUtil.pushHistory('/somewhere');
    cookieUtil.removeToken();

    const history = routerUtil.getHistory();

    checkIsLogin(history.replace);

    expect(window.location.hash).to.equal('#/auth/signin');
  });
  it('redirect to root if has token', () => {
    routerUtil.pushHistory('/somewhere');
    cookieUtil.saveToken('yourFakeToken');

    const history = routerUtil.getHistory();

    ifNeedLogin(history.replace);

    expect(window.location.hash).to.equal('#/');
  });
  it('redirect to root if permission not fit', () => {
    routerUtil.pushHistory('/somewhere');
    cookieUtil.savePermission(['/you', '/cannnot/pass']);

    const history = routerUtil.getHistory();

    permissionCheck('/admin')(history.replace);

    expect(window.location.hash).to.equal('#/');
  });
  it('multiple access check', () => {
    routerUtil.pushHistory('/somewhere');
    cookieUtil.savePermission(['/admin']);
    cookieUtil.saveToken('yourFakeToken');

    const history = routerUtil.getHistory();

    composeChecks(checkIsLogin, permissionCheck('/admin'))(history.replace);

    expect(window.location.hash).to.equal('#/somewhere');
  });
  it('multiple access check fail and redirect', () => {
    routerUtil.pushHistory('/somewhere2');
    cookieUtil.savePermission(['/notadmin']);
    cookieUtil.saveToken('yourFakeToken');

    const history = routerUtil.getHistory();

    composeChecks(permissionCheck('/admin'), checkIsLogin)(history.replace);

    expect(window.location.hash).to.equal('#/');
  });
  it('multiple access check fail and redirect to first fail', () => {
    routerUtil.pushHistory('/somewhere2');
    cookieUtil.savePermission(['/notadmin']);
    cookieUtil.removeToken();

    const history = routerUtil.getHistory();

    composeChecks(checkIsLogin, permissionCheck('/admin'))(history.replace);

    expect(window.location.hash).to.equal('#/auth/signin');
  });
});
