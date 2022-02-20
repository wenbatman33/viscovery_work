/**
 * Check if given value is a positive integer
 * @param value either a Number or a String
 */
export const isNonNegativeInteger = value => value.search(/[\D]/) < 0;

export const isDurationStartEmpty = (config) => {
  if (!config) {
    return true;
  }

  const duration = config.duration;
  return !(duration && duration.start && duration.start.trim());
};

export const isDurationEndEmpty = (config) => {
  if (!config) {
    return true;
  }
  const duration = config.duration;
  return !(duration && duration.end && duration.end.trim());
};

export const isIntervalEmpty = config => !(config && config.interval && config.interval.trim());

export const isLimitEmpty = config => !(config && config.limit && config.limit.trim());

export const isDurationEmpty = config => (
  isDurationStartEmpty(config) && isDurationEndEmpty(config)
);

export const isDurationUnitEmpty = config => (
  !(config && config.duration && config.duration.unit)
);

// value is greater than 100
export const isGT100 = value => Number(value) > 100;


// is start value greater than end value
export const isStartGTEnd = (start, end) => {
  if (!start || !end) {
    return false;
  }
  return Number(start) > Number(end);
};

export const inputPositiveCheck = input => (
  !input || !input.trim() || isNonNegativeInteger(input)
);

const DEFAULT_UNIT = null;

export const EMPTY_CONFIG = {
  interval: null,
  limit: null,
  duration: {
    unit: null,
    start: null,
    end: null,
  },
  valid: {
    interval: true,
    limit: true,
    duration: true,
  },
};

export const getIntervalSecond = config => (
  isIntervalEmpty(config) ? '' : config.interval
);

export const getLimit = config => (
  isLimitEmpty(config) ? '' : config.limit
);

export const getDurationStart = config => (
  isDurationStartEmpty(config) ? '' : config.duration.start
);

export const getDurationEnd = config => (
  isDurationEndEmpty(config) ? '' : config.duration.end
);

export const getDurationUnit = config => (
  isDurationUnitEmpty(config) ? DEFAULT_UNIT : config.duration.unit
);
