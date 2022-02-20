import { expect } from 'chai';
import {
  arrayToObject,
  objectToArray,
  objectToForm,
} from '../dataTypeUtil';

describe('dataTypeUtil testing', () => {
  it('array to object by a key', () => {
    const arr = [
      {
        id: 101,
        foo: 2,
        bar: 3,
      },
      {
        id: 102,
        bar: 3,
      },
      {
        id: 103,
        foo: 5,
      },
    ];

    const actualValue = {
      101: {
        id: 101,
        foo: 2,
        bar: 3,
      },
      102: {
        id: 102,
        bar: 3,
      },
      103: {
        id: 103,
        foo: 5,
      },
    };

    expect(arrayToObject('id')(arr)).to.deep.equal(actualValue);
  });
  it('object to array by a key', () => {
    const obj = {
      101: {
        foo: 2,
        bar: 3,
      },
      102: {
        id: 102,
        bar: 3,
      },
      103: {
        foo: 5,
      },
    };

    const actualValue = [
      {
        id: '101',
        foo: 2,
        bar: 3,
      },
      {
        id: '102',
        bar: 3,
      },
      {
        id: '103',
        foo: 5,
      },
    ];

    expect(objectToArray('id')(obj)).to.deep.equal(actualValue);
  });
  it('object to formData', () => {
    const obj = {
      a: {
        foo: 2,
        bar: 3,
      },
      b: {
        bar: [4, 5, 6],
      },
      c: {
        foo: { bar: 7 },
      },
    };

    const actualValue = new FormData();
    actualValue.append('a',
      {
        foo: 2,
        bar: 3,
      });
    actualValue.append('b',
      {
        bar: [4, 5, 6],
      });
    actualValue.append('c',
      {
        foo: { bar: 7 },
      });

    expect(objectToForm(obj)).to.deep.equal(actualValue);
  });
});
