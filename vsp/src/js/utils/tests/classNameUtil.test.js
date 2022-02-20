import { expect } from 'chai';
import {
  toGray,
} from '../classNameUtil';

describe('classNameUtil testing', () => {
  it('className add gray', () => {
    const resultClassName = 'gray-myClass';

    expect(toGray(true)('myClass')).to.equal(resultClassName);
  });
});
