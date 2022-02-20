/**
 * Created by amdis on 2016/10/6.
 */

export default class Criterion {
  constructor(brandIDs, ratio, duration, included = true) {
    this._brandIDs = brandIDs;
    this._ratio = ratio;
    this._duration = duration;
    this._included = included;
  }

  brandIDs(brandIDs) { // single tag, perhaps make it multiple in the future
    if (brandIDs !== undefined) {
      this._brandIDs = brandIDs.slice();
    }

    return this._brandIDs;
  }

  ratio(ratio) { // ratio level, not percentage
    if (ratio !== undefined) {
      this._ratio = ratio;
    }

    return this._ratio;
  }

  duration(duration) { // unit : seconds
    if (duration !== undefined) {
      this._duration = duration;
    }

    return this._duration;
  }

  included(included) {
    if (included !== undefined) {
      this._included = included;
    }

    return this._included;
  }

  clone() {
    return new Criterion(this.brandIDs(), this.ratio(), this.duration(), this.included());
  }

  _brandsEqual(brandIDs) {
    if (brandIDs.length !== this._brandIDs.length) {
      return false;
    }

    for (const id of brandIDs) {
      if (!this._brandIDs.includes(id)) {
        return false;
      }
    }

    return true;
  }

  equal(criterion) {
    if (criterion instanceof Criterion) {
      const equal = this.included() === criterion.included() &&
          this.duration() === criterion.duration() &&
          this.ratio() === criterion.ratio() &&
          this._brandsEqual(criterion.brandIDs());
      return equal;
    }
    return false;
  }
}
