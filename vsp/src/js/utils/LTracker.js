/**
 * Created Date : 2016/10/18
 * Copyright (c) Viscovery.co
 * Author : Amdis Liu <amdis.liu@viscovery.co>
 * Contributor :
 * Description : Loggly tracker utility
 */

import loggly from 'loggly-jslogger';

const TOKEN = '9965b6c4-181b-41d3-9bcd-a6e76a202419';
const CONF_SEND_CONSOLE_ERROR = true;
const TAG = 'jsLogger';

let LTBaseProp = {};

export default class LTracker {
  /**
   * Initialize loggly tracker
   * @param userProp
   */
  static init(tag) {
    if (this.isEnabled()) {
      const tracker = loggly._LTracker || [];
      const defaultProp = {
        logglyKey: TOKEN,
        sendConsoleErrors: CONF_SEND_CONSOLE_ERROR,
        tag: tag || TAG,
      };
      tracker.push(defaultProp);
    }
  }

  /**
   * send data to Loggly server
   * @param data , a pure object
   */
  static send(data) {
    if (!this.isEnabled()) {
      return;
    }

    const tracker = loggly._LTracker || [];

    if (typeof data === 'string') {
      const combined = Object.assign({}, LTBaseProp);
      combined.data = data;
      tracker.push(combined);
      return;
    }

    if (typeof data === 'object' && data !== null) {
      const combined = Object.assign({}, LTBaseProp, data);
      tracker.push(combined);
    }
  }

  static isEnabled() {
    if (process.env.NODE_ENV !== 'development') {
      return true;
    }
    return false;
  }

  /**
   * For setting project wide property, eg. version, user-agent
   * @param obj
   */
  static addBaseProp(obj) {
    if (typeof obj === 'object' && obj !== null) {
      LTBaseProp = Object.assign({}, LTBaseProp, obj);
    }
  }

  static removeBaseProp(propKey) {
    if (typeof propKey === 'string') {
      if (Object.prototype.hasOwnProperty.call(LTBaseProp, propKey)) {
        delete LTBaseProp[propKey];
      }
    }
  }

}
