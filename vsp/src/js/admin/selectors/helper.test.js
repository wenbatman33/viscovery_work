/**
 * Created by amdis on 2017/7/26.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as helper from './helper';

describe('selector helper tests', () => {
  it('response dictionary to list options', () => {
    const dict1 = { /* eslint-disable quote-props */
      '1': 'Apple',
      '2': 'Banana',
    };

    const expect1 = [
      {
        label: 'Apple',
        value: '1',
      },
      {
        label: 'Banana',
        value: '2',
      },
    ];

    const options1 = helper.responseDictToOptions(dict1);

    expect(options1).to.be.deep.equal(expect1);
  });
});
