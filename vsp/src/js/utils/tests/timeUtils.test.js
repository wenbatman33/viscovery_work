import { expect } from 'chai';
import {
  timeObject,
  validTimeObject,
  timeObjectToString,
  msToString,
} from '../timeUtil';

describe('timeObject testing', () => {
  it('return a timeObject', () => {
    const actualValue = {
      hour: 1,
      min: 20,
      sec: 40,
      ms: 20,
    };
    expect(timeObject(1, 20, 40, 20)).to.deep.equal(actualValue);
  });

  it('return a timeObject even you pass numberable string', () => {
    const actualValue = {
      hour: 1,
      min: 20,
      sec: 40,
      ms: 20,
    };
    expect(timeObject('1', '20', '40', '20')).to.deep.equal(actualValue);
  });
});

describe('validTimeObject testing', () => {
  it('throw error when timeObject contains float', () => {
    const timeObj = {
      hour: 1.1,
      min: 30,
      sec: 20,
      ms: 20,
    };

    expect(() => { validTimeObject(timeObj); }).to.throw(Error);
  });

  it('throw error when timeObject contains negative integer', () => {
    const timeObj = {
      hour: -20,
      min: 30,
      sec: 20,
      ms: 20,
    };

    expect(() => { validTimeObject(timeObj); }).to.throw(Error);
  });

  it('return origin time object if the input is valid', () => {
    const timeObj = {
      hour: 20,
      min: 30,
      sec: 20,
      ms: 20,
    };

    expect(validTimeObject(timeObj)).to.deep.equal({
      hour: 20,
      min: 30,
      sec: 20,
      ms: 20,
    });
  });
});

describe('toStringTemplate testing', () => {
  const timeObj = {
    hour: 1,
    min: 30,
    sec: 2,
    ms: 300,
  };

  it('default format is %H:%M:%S:%MS', () => {
    expect(timeObjectToString(timeObj)).to.equal('01:30:02:30');
  });

  it('switch format into %H-%M-%S-%MS', () => {
    expect(timeObjectToString(timeObj, '%H-%M-%S-%MS')).to.equal('01-30-02-30');
  });

  it('zh-support format', () => {
    expect(timeObjectToString(timeObj, '小時：%H, 分鐘：%M, 秒：%S')).to.equal('小時：01, 分鐘：30, 秒：02');
  });

  it('non-zero-based support', () => {
    expect(timeObjectToString(timeObj, '%H-%M-%S', false)).to.equal('1-30-2');
  });
});

describe('msToString testing', () => {
  const ms = 92000;
  it('return the right format', () => {
    expect(msToString(ms, '%H-%M-%S')).to.equal('00-01-32');
  });
});
