/**
 * Created by amdis on 2017/3/7.
 */

const WAIT_TIME = 1000;

class Queue {
  constructor() {
    this._jobQueue = [];
    this._lock = false;
  }

  addJob = (promiseFunc) => {
    this._enqueue(promiseFunc);
    this._consume();
  };

  _jobCount = () => this._jobQueue.length;

  _enqueue = (func) => {
    this._jobQueue.push(func);
  };

  _dequeue = () => {
    if (this._jobCount() > 0) {
      return this._jobQueue.shift();
    }
    return null;
  };

  _consume = () => {
    if (!this._isLocked() && this._jobCount() > 0) {
      const job = this._dequeue();
      if (job) {
        this._setLock(true);
        Promise.resolve(job()).then(this._jobCallback, this._jobCallback);
      }
    }
  };

  _jobCallback = () => {
    this._setLock(false);
    setTimeout(this._consume, WAIT_TIME);
  };

  _isLocked = () => this._lock;

  _setLock = (toLock) => {
    this._lock = toLock;
  };
}

export default Queue;
