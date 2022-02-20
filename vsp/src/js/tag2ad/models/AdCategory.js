/**
 * Created by Amdis on 2016/10/12.
 */

export default class AdCategory {
  constructor(response) {
    if (!response) {
      this._id = null;
      this._gid = null;
      this._uid = null;
      this._is_shared = false;
      this._name = 'New Category';
      this._children = null;
      return;
    }

    if ('gid' in response) {
      this._gid = response.gid;
    }

    if ('uid' in response) {
      this._uid = response.uid;
    }

    if ('is_shared' in response) {
      this._is_shared = Boolean(response.is_shared);
    }

    if ('filter_id' in response) {
      this._id = response.filter_id;
    }

    if ('filter_name' in response) {
      this._name = response.filter_name;
    }

    if ('subcategory_id' in response) {
      this._subcategory_id = response.subcategory_id;
    }
  }

  isShared(shared) {
    if (shared !== undefined && shared !== null) {
      this._is_shared = shared;
    }

    return this._is_shared;
  }

  id(id) {
    if (id) {
      this._id = id;
    }
    return this._id;
  }

  name(newName) {
    if (newName !== undefined) {
      this._name = newName;
    }

    return this._name;
  }

  children(children) {
    if (children && !Array.isArray(children)) {
      throw new Error('Category model : items must be type of an array');
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

  subCategoryId() {
    return this._subcategory_id;
  }

}
