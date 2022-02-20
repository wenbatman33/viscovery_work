import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as helper from './helper';

describe('GroupForm.js helper tests', () => {
  it('single element isEmpty()', () => {
    expect(helper.isEmpty('')).to.be.true;
    expect(helper.isEmpty(' ')).to.be.true;

    expect(helper.isEmpty(null)).to.be.true;
    expect(helper.isEmpty(undefined)).to.be.true;

    expect(helper.isEmpty({})).to.be.true;
    expect(helper.isEmpty({ a: 1 })).to.be.false;

    expect(helper.isEmpty([])).to.be.true;
    expect(helper.isEmpty(['abc'])).to.be.false;

    expect(helper.isEmpty(5)).to.be.false;
  });

  it('list elements are all non empty', () => {
    const data1 = [
      3,
      'abc',
      null,
    ];
    const data2 = [
      { a: 1 },
      '',
    ];
    expect(helper.isAllNonEmpty(data1)).to.be.false;
    expect(helper.isAllNonEmpty(data2)).to.be.false;
  });
});
