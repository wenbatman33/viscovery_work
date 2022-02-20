export const timeObject = (hour, min, sec, ms) => (
  {
    hour: Number(hour),
    min: Number(min),
    sec: Number(sec),
    ms: Number(ms),
  }
);

export const validTimeObject = (timeObj) => {
  // time object must not contain any float
  const checkFloat = Object.keys(timeObj).filter(ele => (
    timeObj[ele] % 1 > 0
  ));
  if (checkFloat.length > 0) throw Error('time object must not contain any float');

  // time object must not contain any negative integer
  const checkNegative = Object.keys(timeObj).filter(ele => (
    timeObj[ele] < 0
  ));
  if (checkNegative.length > 0) throw Error('time object must not contain any negative integer');

  return timeObj;
};

export const msToTimeObject = (ms) => {
  if (ms < 0) throw Error('ms must not be negative');

  let restMs = ms;

  const hour = Math.floor(restMs / (60 * 60 * 1000));
  restMs %= (60 * 60 * 1000);
  const min = Math.floor(restMs / (60 * 1000));
  restMs %= (60 * 1000);
  const sec = Math.floor(restMs / (1000));
  restMs %= (1000);

  return timeObject(hour, min, sec, restMs);
};

export const timeObjectToString = (tObj, template = '%H:%M:%S:%MS', zeroBased = true) => {
  let timeObj = validTimeObject(tObj);
  timeObj = Object.keys(timeObj).reduce((pV, cV) => {
    const result = {
      ...pV,
    };
    const tmp = timeObj[cV].toString();
    if (zeroBased) {
      result[cV] = tmp.length === 1 ? `0${tmp}` : tmp;
    } else {
      result[cV] = tmp;
    }
    return result;
  }, {});

  return template.replace('%H', timeObj.hour)
          .replace('%M', timeObj.min)
          .replace('%S', timeObj.sec)
          .replace('%MS', timeObj.ms.substring(0, 2));
};


export const handleMsViaTimeObject = fn => (
  (sec, ...rest) => (
    fn(msToTimeObject(sec), ...rest)
  )
);

export const msToString = handleMsViaTimeObject(timeObjectToString);
