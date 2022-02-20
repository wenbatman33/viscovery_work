import moment from 'moment';

export const byUsername = record =>
  record.username;

export const reduceRecordForModels = (pV, cV) => (
  {
    ...pV,
    [cV.model_id]: cV.count,
  }
);

const handleNumber = num => num || 0;

export const sortByKey = key => (a, b) => {
  if (typeof a[key] === 'string') {
    if (a[key].toLowerCase() > b[key].toLowerCase()) {
      return 1;
    }
    return -1;
  }

  if (a[key] > b[key]) {
    return 1;
  }
  return -1;
};

export const reduceRecordForSum = (pV, cV) => (
  {
    count: handleNumber(pV.count) + handleNumber(cV.count),
    confirm: handleNumber(pV.confirm) + handleNumber(cV.confirm),
    delete: handleNumber(pV.delete) + handleNumber(cV.delete),
    label: handleNumber(pV.label) + handleNumber(cV.label),
    modify: handleNumber(pV.modify) + handleNumber(cV.modify),
    sumOfTimeDuration: handleNumber(pV.sumOfTimeDuration) + handleNumber(cV.sum_of_time_duration),
  }
);

export const filterBetween = (since, to) => report =>
  moment(report.report_time).isBetween(since, to, 'day', '[]');

export const getDomainLevel = (days) => {
  if (days <= 14) {
    return 'day';
  } else if (days <= 30) {
    return 'twoDays';
  } else if (days <= 63) {
    return 'week';
  } else if (days <= 89) {
    return 'twoWeeks';
  }
  return 'months';
};

export const dateTickFormat = (d, i) => (domainLevel) => {
  switch (domainLevel) {
    case 'day':
      return moment(d, 'YYYYMMDD').format('MM/DD');
    case 'twoDays':
      return i % 2 === 0 ? moment(d, 'YYYYMMDD').format('MM/DD') : null;
    case 'week':
      return i % 7 === 0 ? moment(d, 'YYYYMMDD').format('MM/DD') : null;
    case 'twoWeeks':
      return i % 14 === 0 ? moment(d, 'YYYYMMDD').format('MM/DD') : null;
    default:
      return moment(d, 'YYYYMMDD').date() === 1 ? moment(d, 'YYYYMMDD').format('YYYY/MM') : null;
  }
};

