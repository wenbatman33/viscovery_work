import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import humanize from 'humanize';
import moment from 'moment';
import {
  msToString,
} from 'utils/timeUtil';

import styles from './ShiftMultiDaySummary.scss';

const defaultZero = R.defaultTo(0);

const sumWithKey = key => R.compose(
  R.sum,
  R.map(ele => ele[key])
);

const findSameTimePeople = (a, b) => {
  const getProps = R.props(['report_time', 'assignee_id']);
  return R.equals(getProps(a), getProps(b));
};

const groupbyDayAssignId = R.compose(
  R.map(ele => R.reduce(
      (pV, cV) => ({
        ...cV,
        sum_of_time_duration:
        defaultZero(pV.sum_of_time_duration) + defaultZero(cV.sum_of_time_duration),
        count: defaultZero(pV.count) + defaultZero(cV.count),
      }),
      {},
      ele,
    )),
  R.groupWith(findSameTimePeople),
);

const handlePeopleMean = R.compose(
  R.mean,
  R.map(ele => ele.length),
  R.groupWith(R.equals),
  R.map(ele => ele.report_time),
);

const handelMeanCount = data => (peopleMean) => {
  const totalseconds = sumWithKey('sum_of_time_duration')(data);
  const totalCount = sumWithKey('count')(data);
  const hours = moment.duration(totalseconds, 'seconds').asHours();
  return (totalCount / hours) * peopleMean;
};

const ShiftMultiDaySummary = ({ data }) => {
  const processedData = groupbyDayAssignId(data);
  const peopleMean = handlePeopleMean(processedData);
  const meanCount = handelMeanCount(processedData)(peopleMean);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p
          styleName="block__title"
        >
          總工時
        </p>
        <p styleName="block__number">
          {msToString(sumWithKey('sum_of_time_duration')(processedData) * 1000, '%Hhr %Mm', false)}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p
          styleName="block__title"
        >
          平均人數
        </p>
        <div>
          <p styleName="block__number">
            {humanize.numberFormat(peopleMean, 1)}
          </p>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p
          styleName="block__title"
        >
          總標籤數
        </p>
        <p styleName="block__number">
          {humanize.numberFormat(sumWithKey('count')(processedData), 0)}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p
          styleName="block__title"
        >
          每小時產值
        </p>
        <p styleName="block__number">
          {humanize.numberFormat(meanCount, 0)}
        </p>
      </div>
    </div>
  );
};

ShiftMultiDaySummary.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default CSSModules(ShiftMultiDaySummary, styles);
