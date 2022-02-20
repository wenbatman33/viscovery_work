/**
* Created Date : 2016/10/4
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description : A custom type of object for easier operation on filter CRUD
*/

import Criterion from './Criterion';

const MODEL_VERSION = 1;

/**
 * expected format of a filter
 * {
*   "gid": "1",
    "is_shared": 1,
    "uid": 1
    "filter_id": "580f6a03c32ddd0007a9938e",
    "filter_name": "Custom Filter 1",
    "filter_content": {
        "version": 1,
        "criteria": [
            {
                "brand_id": 1,
                "duration": 30000,
                "ratio": 40,
                "included": true
            }
        ]
    }
  }
 */
export default class Filter {
  constructor(response) {
    if (!response) {
      this._id = null;
      this._gid = null;
      this._uid = null;
      this._is_shared = false;
      this._name = 'New Filter';
      this._criteria = [];
      this._version = MODEL_VERSION;
      this._children = null;
      return;
    }

    if ('gid' in response) { this._gid = response.gid; }

    if ('uid' in response) { this._uid = response.uid; }

    if ('is_shared' in response) { this._is_shared = Boolean(response.is_shared); }

    if (response.filter_id) { this._id = response.filter_id; }

    if (response.filter_name) { this._name = response.filter_name; }

    if ('subcategory_id' in response) { this._subCategoryId = response.subcategory_id; }

    if (response.filter_content) {
      const content = response.filter_content;
      if (content.version !== undefined) { this._version = content.version; }

      this._criteria = content.criteria.map(genCriterion);
    }
  }

  criteria(criteria) {  // A array of Criterion objects
    if (criteria !== undefined) {
      this._criteria = criteria.map(genCriterion);
    }

    return this._criteria;
  }

  name(newName) {
    if (newName !== undefined) {
      this._name = newName;
    }

    return this._name;
  }

  uid(uid) {
    if (uid !== undefined) {
      this._uid = uid;
    }
    return this._uid;
  }

  gid(gid) {
    if (gid !== undefined) {
      this._gid = gid;
    }
    return this._gid;
  }

  id(id) {
    if (id !== undefined) {
      this._id = id;
    }
    return this._id;
  }

  version(version) {
    if (version !== undefined) {
      this._version = version;
    }
    return this._version;
  }

  isShared(shared) {
    if (shared !== undefined && shared !== null) {
      this._is_shared = shared;
    }
    return this._is_shared;
  }

  subCategoryId() {
    return this._subCategoryId;
  }

  /**
   * Expect children to be array of Filter models
   * @param children
   * @return {*|null}
   */
  children(children) {
    if (children && !Array.isArray(children)) {
      throw new Error('Filter model : items must be type of an array');
    }

    if (Array.isArray(children)) {
      this._children = children;
    }

    return this._children;
  }

  hasChildren() {
    if (this._children == null || this._children.length < 1) {
      return false;
    }
    return true;
  }

  /**
   * Expect child to be an instance of Filter
   * @param child
   */
  addChild(child) {
    if (!this.children()) {
      this.children([child]);
    } else {
      this.children([...this.children(), child]);
    }
  }

  getContentJSON() {
    const result = {};
    const filterContent = [];

    if (Array.isArray(this._criteria)) {
      this._criteria.forEach((criterion) => {
        const element = {};
        element.brand_ids = criterion.brandIDs();
        element.ratio = criterion.ratio();
        element.duration = criterion.duration();

        filterContent.push(element);
      });
    }

    result.version = this.version();
    result.criteria = filterContent;

    return result;
  }

  clone() {
    const clone = new Filter();
    clone.id(this.id());
    clone.version(this.version());
    clone.name(this.name());
    clone.criteria(this.criteria());
    clone._is_shared = this.isShared();
    clone._subCategoryId = this.subCategoryId();
    return clone;
  }
}

const genCriterion = (item) => {
  const criterion = new Criterion();

  if (item instanceof Criterion) {
    criterion.duration(item.duration());
    criterion.brandIDs(item.brandIDs());
    criterion.ratio(item.ratio());
    criterion.included(item.included());
  } else {
    if ('duration' in item) { criterion.duration(item.duration); }

    if ('brand_ids' in item) { criterion.brandIDs(item.brand_ids); }

    if ('ratio' in item) { criterion.ratio(item.ratio); }

    if ('included' in item) { criterion.included(item.included); }
  }

  return criterion;
};
