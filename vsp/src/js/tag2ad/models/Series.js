/**
 * Created by amdis on 2016/10/6.
 */

export default class Series {
  constructor(response) {
    if (response && typeof response === 'object') {
      if (response.series_id) {
        this._id = response.series_id;
      }
      if (response.series_name) {
        this._name = response.series_name;
      }
      if (response.is_default) {
        this._isDefault = response.is_default;
      }
      if (response.summary && response.summary.total) {
        this._total = response.summary.total;
      }
      if (response.summary && response.summary.available) {
        this._available = response.summary.available;
      }
    } else {
      this._id = null;
      this._name = '';
      this._isDefault = false;
      this._available = this._total = 0;
    }
  }

  id(newId) {
    if (newId !== undefined) {
      this._id = newId;
    }
    return this._id;
  }

  name(newName) {
    if (newName !== undefined) {
      this._name = newName;
    }
    return this._name;
  }

  isDefault() {
    return this._isDefault;
  }

  total() {
    return this._total;
  }

  available() {
    return this._available;
  }
}
