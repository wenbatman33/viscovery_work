/**
 * Created by amdis on 2017/7/28.
 */
export const isAllNonEmpty = (arr) => {
  if (arr === undefined || arr === null) {
    return false;
  }
  return arr.every(ele => !isEmpty(ele));
};

export const isEmpty = (ele) => {
  if (ele === undefined || ele === null) {
    return true;
  }

  if (Array.isArray(ele) && ele.length === 0) {
    return true;
  }

  if (typeof ele === 'object' && JSON.stringify(ele) === '{}') {
    return true;
  }

  if (typeof ele === 'string' && !ele.trim()) {
    return true;
  }

  return false;
};

