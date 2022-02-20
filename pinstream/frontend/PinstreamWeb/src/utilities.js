const PinstreamUtilitiesWeb = {
  indexpage: process.env.NODE_ENV === 'production' ? '/' : '/',
  keys: ['uid', 'token', 'refresh_token', 'expires_in', 'source_id', 'imgid', 'username'],
  clientId: '251406c814554f7ca509545b78ae9578',
  uid: () => PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[0]),
  isExpires: () => {
    const info = PinstreamUtilitiesWeb.getTokenInfofromlocalStorage();
    if (!info) { return true; }
    const dtNow = Math.floor(Date.now() / 1000);
    return ((parseInt(info[PinstreamUtilitiesWeb.keys[3]], 10) || 0) - dtNow <= 300);
  },
  setTokenInfoTolocalStorage: (info) => {
    PinstreamUtilitiesWeb.localStorageSetIem(
      PinstreamUtilitiesWeb.keys[0], info[PinstreamUtilitiesWeb.keys[0]]);
    PinstreamUtilitiesWeb.localStorageSetIem(
      PinstreamUtilitiesWeb.keys[1], info[PinstreamUtilitiesWeb.keys[1]]);
    PinstreamUtilitiesWeb.localStorageSetIem(
      PinstreamUtilitiesWeb.keys[2], info[PinstreamUtilitiesWeb.keys[2]]);
    PinstreamUtilitiesWeb.localStorageSetIem(
      PinstreamUtilitiesWeb.keys[3], info[PinstreamUtilitiesWeb.keys[3]]);
  },
  getTokenInfofromlocalStorage: () => {
    const info = {};
    info[PinstreamUtilitiesWeb.keys[0]] =
      PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[0]);
    info[PinstreamUtilitiesWeb.keys[1]] =
      PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[1]);
    info[PinstreamUtilitiesWeb.keys[2]] =
      PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[2]);
    info[PinstreamUtilitiesWeb.keys[3]] =
      PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[3]);
    return info;
  },
  removeTokenInfoTolocalStorage: () => localStorage.clear(),
  localStorageGetIem: key => localStorage.getItem(key),
  localStorageSetIem: (key, value) => localStorage.setItem(key, value),
  localStorageRemoveIem: key => localStorage.removeItem(key),
  merge: (obj1, obj2) => {
    const merged = {};
    Object.keys(obj1).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj1, key)) {
        merged[key] = obj1[key];
        Object.keys(obj2).forEach((key2) => {
          if (Object.prototype.hasOwnProperty.call(obj2, key2)) {
            merged[key] = obj2[key2];
          }
        });
      }
    });
    return merged;
  },
  updatetoken: (callback) => {
    const info = PinstreamUtilitiesWeb.getTokenInfofromlocalStorage();
    const data = `${PinstreamUtilitiesWeb.keys[0]}=${info[PinstreamUtilitiesWeb.keys[0]]}&${PinstreamUtilitiesWeb.keys[2]}=${info[PinstreamUtilitiesWeb.keys[2]]}&${PinstreamUtilitiesWeb.keys[3]}=${info[PinstreamUtilitiesWeb.keys[3]]}&${PinstreamUtilitiesWeb.keys[4]}=${PinstreamUtilitiesWeb.clientId}`;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', () => {
      if (this.readyState === 4) {
        const resData = JSON.parse(this.responseText);
        if (resData && resData.isSuccess) {
          PinstreamUtilitiesWeb.setTokenInfoTolocalStorage(resData);
        }
        callback(resData);
      }
    });

    xhr.open('POST', 'https://leejulee.pythonanywhere.com/api/v1/token');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('authorization', `Token ${info[PinstreamUtilitiesWeb.keys[1]]}`);
    xhr.setRequestHeader('cache-control', 'no-cache');

    xhr.send(data);
  },
  mobilecheck: () => {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    }
    return false;
  }
};

exports.PinstreamUtilitiesWeb = PinstreamUtilitiesWeb;
