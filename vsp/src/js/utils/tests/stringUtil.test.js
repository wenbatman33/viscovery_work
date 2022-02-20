import { expect } from 'chai';
import {
  mathToZh,
  CamelToSnake,
  SnakeToCamel,
  handleMoreThanWord,
} from '../stringUtil';

describe('stringUtil testing', () => {
  it('tens digits numbers to zh', () => {
    const actualValue = '二十三';

    expect(mathToZh(23)).to.equal(actualValue);
  });

  it('hundreds digits numbers to zh', () => {
    const actualValue = '一百二十三';

    expect(mathToZh(123)).to.equal(actualValue);
  });

  it('thousands digits numbers to zh', () => {
    const actualValue = '五千一百二十三';

    expect(mathToZh(5123)).to.equal(actualValue);
  });

  it('ten thousands digits numbers to zh', () => {
    const actualValue = '九萬五千一百二十三';

    expect(mathToZh(95123)).to.equal(actualValue);
  });

  it('hundreds digits numbers with zero to zh', () => {
    const actualValue = '一百零三';

    expect(mathToZh(103)).to.equal(actualValue);
  });

  it('thousands digits numbers with zero to zh', () => {
    const actualValue = '二千零三';

    expect(mathToZh(2003)).to.equal(actualValue);
  });

  it('ten thousands digits numbers with zero to zh', () => {
    const actualValue = '五萬零八百零三';

    expect(mathToZh(50803)).to.equal(actualValue);
  });

  it('millions digits numbers with zero to zh', () => {
    const actualValue = '八百零三萬九千';

    expect(mathToZh(8039000)).to.equal(actualValue);
  });

  it('Snake to Camel', () => {
    const inputStr = 'aaa_bbb_ccc';
    const resultStr = 'aaaBbbCcc';

    expect(SnakeToCamel(inputStr)).to.equal(resultStr);
  });

  it('Camel to Snake', () => {
    const inputStr = 'aaaBbbCcc';
    const resultStr = 'aaa_bbb_ccc';

    expect(CamelToSnake(inputStr)).to.equal(resultStr);
  });

  it('More than words with String', () => {
    const inputStr = '一二三四五六七八九十';
    const limitCount = 5;
    const resultStr = '一二三四五...';

    expect(handleMoreThanWord(limitCount)(inputStr)).to.equal(resultStr);
  });
});
