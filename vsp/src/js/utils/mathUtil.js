import R from 'ramda';

export const sum = arr => key => (
  arr.reduce(
    (pV, cV) => cV[key] + pV,
    0
  )
);

export const sumByProps = propsArray => arr => (
  R.reduce(
    (pV, cKey) => ({
      ...pV,
      [cKey]: R.sum(R.map(R.pathOr(0, [cKey]))(arr)),
    }),
    {}
  )(propsArray)
);

export const sumWithKey = key => R.compose(
  R.sum,
  R.map(ele => ele[key])
);

/**
 * Compute if num is >= min and <= max
 * @param num
 * @param min
 * @param max
 * @return {*}
 */
export const between = (num, min, max) => {
  if (!nullCheck(num, min, max)) {
    return false;
  }

  const upperBound = Math.max(min, max);
  const lowerBound = Math.min(min, max);

  return !(num < lowerBound || num > upperBound);
};

/**
 *
 * @return {boolean} True if all args are not neither null nor undefined
 */
const nullCheck = (...args) => {
  for (let i = 0; i < args.length; i += 1) {
    const num = args[i];
    if (num === undefined || num == null) {
      return false;
    }
  }
  return true;
};
