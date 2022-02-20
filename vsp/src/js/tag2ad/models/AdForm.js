/**
 * Created by Amdis on 2016/10/12.
 */

import { API_LOCALE } from '../constants';

export default class AdForm {
  constructor(responseData) {
    // responseData = a single form object in the response, eg. response.forms[0]
    if (responseData && typeof responseData === 'object') {
      if (responseData.id) { this._id = responseData.id; }
      if (responseData.name) { this._name = responseData.name; }

      if (responseData.name_zh_cn) {
        this._name_zh_cn = responseData.name_zh_cn;
      }
      if (responseData.name_zh_tw) {
        this._name_zh_tw = responseData.name_zh_tw;
      }
      if ('duration' in responseData) { this._duration = responseData.duration; }

      if ('width' in responseData) { this._width = responseData.width; }

      if ('height' in responseData) { this._height = responseData.height; }

      if ('type' in responseData) { this._type = responseData.type; }
    } else {
      this._id = null;
      this._name = 'New Ad Form';
      this._width = null;
      this._height = null;
      this._type = null;
    }
  }

  id() {
    return this._id;
  }

  name(language = API_LOCALE.ZH_TW) {
    if (this._name_zh_tw && language === API_LOCALE.ZH_TW) {
      return this._name_zh_tw;
    }
    if (this._name_zh_cn && language === API_LOCALE.ZH_CN) {
      return this._name_zh_cn;
    }
    return this._name;
  }

  duration() {
    return this._duration;
  }

  width() {
    return this._width;
  }

  height() {
    return this._height;
  }

  type() {
    return this._type;
  }
}
