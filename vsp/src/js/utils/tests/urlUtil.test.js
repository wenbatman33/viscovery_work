import { expect } from 'chai';
import {
  bindQueryString,
} from '../urlUtil';

describe('urlUtil testing', () => {
  it('bindQuery test ignore null/undefined', () => {
    const url = 'myurl';
    const QueryObj = {
      questionA: 'aaa',
      propertyB: 'bbb',
      queryC: null,
      propD: 1000,
      qE: undefined,
    };
    const combinedUrl = 'myurl?questionA=aaa&propertyB=bbb&propD=1000';

    expect(bindQueryString(url)(QueryObj)).to.equal(combinedUrl);
  });
});
