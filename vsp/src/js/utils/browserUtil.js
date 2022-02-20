/**
* Created Date : 2016/10/19
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description : To get browser vendor and version
*/

// this works for Chrome , Firefox, Safari, Edge
function _getBrowserVersion(name) {
  if (!name) {
    return null;
  }

  const ua = window.navigator.userAgent.split(' ');
  const browserNVersion = ua.filter(item =>
    item.indexOf(`${name}/`) > -1
  );

  if (browserNVersion.length > 0) {
    const version = browserNVersion[0].split('/')[1];
    return version;
  }

  return null;
}

function _getIEVersion(name) {
  if (!name) {
    return null;
  }

  const MSIERe = new RegExp('MSIE [0-9]+.[0-9]+');
  const IE11Re = new RegExp('rv:[0-9]+.[0-9]+');

  const ua = window.navigator.userAgent;

  const msie = MSIERe.exec(ua);
  if (msie && msie.length > 0) {
    return msie[0].split(' ')[1];
  }

  const ie11 = IE11Re.exec(ua);
  if (ie11.length > 0) {
    return ie11[0].split(':')[1];
  }

  return null;
}

export default class browserUtil {
  static name() {
    // Return cached result if avalible, else get result then cache it.
    if (this._name) {
      return this._name;
    }

    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    // eslint-disable-next-line no-undef
    const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    const isFirefox = typeof InstallTrigger !== 'undefined';

    // At least Safari 3+: "[object HTMLElementConstructor]"
    const isSafari = !!window.safari;

    // Chrome 1+
    const isChrome = !!window.chrome && !isOpera;

    // At least IE6
    const isIE = /*@cc_on!@*/false || !!document.documentMode; // eslint-disable-line spaced-comment

    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;

    if (isOpera) {
      this._name = 'Opera';
    } else if (isFirefox) {
      this._name = 'Firefox';
    } else if (isSafari) {
      this._name = 'Safari';
    } else if (isChrome) {
      this._name = 'Chrome';
    } else if (isIE) {
      this._name = 'IE';
    } else if (isEdge) {
      this._name = 'Edge';
    } else {
      this._name = 'Unknown';
    }

    return this._name;
  }

  static version() {
    const name = this.name();

    if (window.navigator) {
      const version = _getBrowserVersion(name) || _getIEVersion(name) || -1;

      return version;
    }
    return null;
  }
}

