import { expect } from 'chai';
import {
  sum,
  sumWithKey,
  between,
  sumByProps,
} from '../mathUtil';

describe('mathUtil testing', () => {
  it('curried sum object array value with specific key', () => {
    const inputArr = [
      {
        foo: 5,
        bar: 6,
      },
      {
        foo: 5,
        bar: 6,
      },
      {
        foo: 5,
        bar: 6,
      },
    ];
    const curryFunc = sum(inputArr);
    expect(curryFunc('foo')).to.equal(15);
    expect(curryFunc('bar')).to.equal(18);
  });

  it('sum object array value with specific key', () => {
    const inputArr = [
      {
        foo: 5,
        bar: 6,
      },
      {
        foo: 5,
        bar: 6,
      },
      {
        foo: 5,
        bar: 6,
      },
    ];
    expect(sumWithKey('foo')(inputArr)).to.equal(15);
  });

  it('check num between min and max', () => {
    expect(between(10, 1, 10)).to.equal(true);
  });

  it('sum object array value only with specific keys', () => {
    const inputArr = [
      {
        foo: 5,
        bar: 6,
        baz: 7,
      },
      {
        foo: 5,
        bar: 6,
        gor: 8,
      },
      {
        foo: 5,
        baz: 7,
      },
    ];

    const actualValue = {
      foo: 15,
      bar: 12,
    };
    expect(sumByProps(['foo', 'bar'])(inputArr)).to.deep.equal(actualValue);
  });
});
