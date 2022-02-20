export const SnakeToCamel = snake =>
  snake.replace(/_([a-z])/g, g => g[1].toUpperCase());

export const CamelToSnake = camel =>
  camel.replace(/([A-Z])/g, g => `_${g[0].toLowerCase()}`);

export const handleMoreThanWord = limitCount => (str) => {
  if (str) {
    return (str.length > limitCount ? str.replace(new RegExp(`(.{${limitCount}})(.*)`), '$1...') : str);
  }
  return str;
};

const araZhNumMapping = {
  zero: '零',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
};

const last = arr => arr[arr.length - 1];

/**
 *
 * @param {Number} num
 * @sig Number -> Number
 */
const getLastDigit = num =>
  Number(last(String(Math.floor(num))));

/**
 *
 * @param {String} subfix
 * @param {Number} num
 * @sig String -> Number -> String
 *
 */
const handleDigits = subfix => (num) => {
  if (subfix !== '萬') return (getLastDigit(num) === 0 ? '#' : `${araZhNumMapping[getLastDigit(num)]}${subfix}`);
  return `${mathToZh(num)}${subfix}`;
};

const DIVIDE_NUMBERS = [
  {
    divide: 10000,
    subfix: '萬',
  },
  {
    divide: 1000,
    subfix: '千',
  },
  {
    divide: 100,
    subfix: '百',
  },
  {
    divide: 10,
    subfix: '十',
  },
  {
    divide: 1,
    subfix: '',
  },
];

const handleLastZhzero = str =>
  (str.slice(str.length - 1, str.length) === araZhNumMapping.zero
    ? str.slice(0, str.length - 1)
    : str);

/**
 *
 * @param {Number} num
 * @sig Number -> String
 *
 * @note: limitition: num < 10000000
 */
export const mathToZh = (num) => {
  const divideNumbers = DIVIDE_NUMBERS.filter(e => (num / e.divide) >= 1);
  const stringArray = divideNumbers.map(e => handleDigits(e.subfix)(num / e.divide));
  const zhString = stringArray.join('');
  const replaceZeroToZh = zhString.replace(/#+/g, '零');

  return handleLastZhzero(replaceZeroToZh);
};
