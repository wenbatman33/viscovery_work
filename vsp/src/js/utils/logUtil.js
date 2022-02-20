/**
* Created Date : 2016/9/20
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description :
*/


export default class logUtil {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.enabled = false;
    } else {
      this.enabled = true;
    }
    this.console = window.console || {};
  }

  info(msg) {
    this.doLog('info', msg);
  }

  error(msg) {
    this.doLog('error', msg);
  }

  warn(msg) {
    this.doLog('warn', msg);
  }

  debug(msg) {
    this.log(msg);
  }

  log(msg) {
    this.doLog('log', msg);
  }

  exception(msg) {
    this.doLog('exception', msg);
  }

  doLog(level, msg) {
    if (this.isUsable(level)) {
      this.console[level](msg);
    }
  }

  isUsable(level) {
    const usable = this.enabled && this.console && this.console[level];
    return usable;
  }
}

export const LogUtil = new logUtil();
