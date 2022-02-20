/**
 * Get Search Query
 * @return {object} {query1:1, query2:2}
 */
export function getUrlQuery(path) {
    path = path ? path.split('?') : undefined;
    let match,
        pl     = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = path ? path.length === 1 ? path[0] : path[1] : window.location.search.substring(1);

    var urlParams = {};
    while (match = search.exec(query)) urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}

/**
 * 是否有touch事件，藉以判斷為行動裝置
 * @return {Boolean} true || false
 */
export function isTouchDevice() {
  return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) || false;

  // return 'ontouchstart' in window        // works on most browsers
  //     || navigator.maxTouchPoints;       // works on IE10/11 and Surface
}

/**
 * 偵測裝置類型
 * @return 'windowPhone' || 'android' || 'android+chrome' || 'iOS' || 'desktop'
 */
export function getDevice() {
  if(isTouchDevice()) {
    if (navigator.userAgent.match(/FB/i)) {
      return 'fb'
    } else if (navigator.userAgent.match(/Windows Phone/i)) {
      // Windows Phone
      return 'windowPhone';
    } else if (navigator.userAgent.match(/Android/i)) {
      if (navigator.userAgent.match(/Chrome/i)) {
        // Android + Chrome
        return 'android+chrome';
      } else {
        // Android + 非 Chrome
        return 'android';
      }
    } else if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
      // iOS
      return 'iOS';
    } else {
      // 其他
      return 'desktop';
    }
  } else {
    return 'desktop';
  }
}

/**
 * 檢查iOS版本
 * @return false || 版本號 e.q. "9.1"
 */
export function getIOSVersion() {
  var ua = navigator.userAgent;

  if(ua.indexOf('iPhone') === -1 &&
     ua.indexOf('iPad') === -1 &&
     ua.indexOf('iPod') === -1)
    return false;

  var i = ua.indexOf(' OS ') + 4;

  return ua.substring(i, ua.indexOf(' ', i)).replace(/_/g, '.');
}


/**
 * 檢查是否能使用XMLHttpRequest跨網域資源
 * @return {Boolean} true || false
 */
export function canCors() {
  return 'XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest();
}

/**
 * 判斷是否是iOS上的Safari瀏覽器
 * @return {Boolean} true || false
 */
export function iOSSafari() {
    return /iP(ad|od|hone)/i.test(window.navigator.userAgent) && /WebKit/i.test(window.navigator.userAgent) && !(/(CriOS|FxiOS|OPiOS|mercury)/i.test(window.navigator.userAgent));
}

/**
 * 偵測 Flash Player Version
 * @return string e.q. "22,0,0" "0,0,0"
 */
export function getFlashVersion() {
  // ie
  try {
    try {
      var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
      try { axo.AllowScriptAccess = 'always'; }
      catch(e) { return '6,0,0'; }
    } catch(e) {}
    return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
  // other browsers
  } catch(e) {
    try {
      if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
        return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
      }
    } catch(e) {}
  }
  return '0,0,0';
}
