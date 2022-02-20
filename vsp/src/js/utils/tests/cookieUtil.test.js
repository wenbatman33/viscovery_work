import { expect } from 'chai';
import cookieUtil from '../cookieUtil';

describe('cookieUtil testing', () => {
  it('save token then check', () => {
    const testToken = 'yourFakeToken';
    cookieUtil.saveToken(testToken);
    expect(cookieUtil.isTokenExisted()).to.equal(true);
    expect(cookieUtil.getToken()).to.equal(testToken);
  });
  it('remove then check TokenExisted', () => {
    cookieUtil.removeToken();
    expect(cookieUtil.isTokenExisted()).to.equal(false);
  });
  it('save uid then get', () => {
    const testUid = '0';
    cookieUtil.saveUid(testUid);
    expect(cookieUtil.getUid()).to.equal(testUid);
  });
  it('remove uid then get', () => {
    cookieUtil.removeUid();
    expect(cookieUtil.getUid()).to.equal(null);
  });
  it('save account then get', () => {
    const testAccount = 'vis_test';
    cookieUtil.saveAccount(testAccount);
    expect(cookieUtil.getAccount()).to.equal(testAccount);
  });
  it('remove account then get', () => {
    cookieUtil.removeAccount();
    expect(cookieUtil.getAccount()).to.equal(null);
  });
  it('save permissions then get', () => {
    const testPerissions = ['cms', 'hrs/admin'];
    cookieUtil.savePermission(testPerissions);
    expect(cookieUtil.getPermission()).to.deep.equal(testPerissions);
  });
  it('remove permissions then get', () => {
    cookieUtil.removePermission();
    expect(cookieUtil.getPermission()).to.deep.equal(null);
  });
  it('save Group/Role then check', () => {
    const testGroup = 'visGroup';
    const testRole = 'vis_member';
    cookieUtil.saveGroupAndRole(testGroup, testRole);
    expect(cookieUtil.isGroupOrRoleExist()).to.equal(true);
    expect(cookieUtil.getGroup()).to.equal(testGroup);
    expect(cookieUtil.getRole()).to.equal(testRole);
  });
  it('remove Group/Role then check', () => {
    cookieUtil.removeGroup();
    expect(cookieUtil.isGroupOrRoleExist()).to.equal(false);
    expect(cookieUtil.getGroup()).to.equal(null);
    cookieUtil.removeRole();
    expect(cookieUtil.getRole()).to.equal(null);
  });
  it('save Group/Role id then check', () => {
    const testGroupId = 5;
    const testRoleId = 3;
    cookieUtil.saveGRids(testGroupId, testRoleId);
    expect(cookieUtil.getGroupKey()).to.equal(testGroupId);
    expect(cookieUtil.getRoleKey()).to.equal(testRoleId);
  });
  it('remove Group/Role id then check', () => {
    cookieUtil.rmGRids();
    expect(cookieUtil.getGroupKey()).to.equal(0);
    expect(cookieUtil.getRoleKey()).to.equal(0);
  });
  it('save ViewHrs then check', () => {
    const testViewHrs = 3030;
    cookieUtil.saveViewHrs(testViewHrs);
    expect(cookieUtil.getViewHrs()).to.equal(testViewHrs);
  });
  it('remove ViewHrs then check', () => {
    cookieUtil.rmViewHrs();
    expect(cookieUtil.getViewHrs()).to.equal(0);
  });
  it('set locale then check', () => {
    const testLocale = 'zh-TW';
    cookieUtil.setLocale(testLocale);
    expect(cookieUtil.getLocale()).to.equal(testLocale);
  });
  it('remove locale then check', () => {
    cookieUtil.removeLocale();
    expect(cookieUtil.getLocale()).to.equal(null);
  });
});
