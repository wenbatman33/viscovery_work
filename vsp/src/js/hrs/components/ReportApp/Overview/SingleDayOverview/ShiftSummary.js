import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import humanize from 'humanize';

import {
  msToString,
} from 'utils/timeUtil';

import styles from './ShiftSummary.scss';

import {
  byUsername,
  reduceRecordForSum,
} from '../../utils';

const groupbyAssigneeId = R.groupBy(byUsername);

const mapDataForAssignee = groupData => R.map(
  ele => ele.reduce(reduceRecordForSum, {}),
  groupData
);

const handleDataForShift = R.compose(
  R.map(ele => (
    {
      ...ele,
      efficiency: ele.count / ele.sumOfTimeDuration,
    }
  )),
  R.map(ele => (
    {
      ...ele[1],
      username: ele[0],
    }
  )),
  R.toPairs,
  mapDataForAssignee,
  groupbyAssigneeId
);

const sumWithKey = key => R.compose(
  R.sum,
  R.map(ele => ele[key])
);

const compareCompute = R.compose(
  number => (number ? `${number}%` : ''),
  Math.round,
  number => number * 100,
  (today, yesterday) => (today - yesterday) / yesterday
);

const getEfficiency = (summaryData) => {
  const counts = sumWithKey('count')(summaryData);
  const time = sumWithKey('sumOfTimeDuration')(summaryData) / 3600;

  return counts / time;
};

const ShiftSummary = ({ data, comparedData, shiftWorkingTime }) => {
  const summaryData = handleDataForShift(data);
  const summaryComparedData = handleDataForShift(comparedData);

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
          操作標籤
        </p>
        <p styleName="block__number">
          {humanize.numberFormat(sumWithKey('count')(summaryData), 0)}
        </p>
        <div>
          {
            (comparedData.length > 0)
            ?
              <div>
                <p styleName="compare__prefix">比前一日</p>
                <p styleName="compare__number">
                  {compareCompute(sumWithKey('count')(summaryData), sumWithKey('count')(summaryComparedData))}
                </p>
              </div>
            : null
          }
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
          每小時人均標籤
        </p>
        <div>
          <p styleName="block__number">
            {humanize.numberFormat(getEfficiency(summaryData), 0)}
          </p>
          <p styleName="block__unit">
            標籤/人
          </p>
        </div>
        <div>
          {
            (comparedData.length > 0)
            ?
              <div>
                <p styleName="compare__prefix">比前一日</p>
                <p styleName="compare__number">
                  {compareCompute(getEfficiency(summaryData), getEfficiency(summaryComparedData))}
                </p>
              </div>
            : null
          }
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
          人數
        </p>
        <p styleName="block__number">
          {summaryData.length}
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
          標準工時
        </p>
        <p styleName="block__number">
          {msToString(summaryData.length * shiftWorkingTime * 1000, '%Hhr', false)}
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
          實際工時
        </p>
        <p styleName="block__number">
          {msToString(sumWithKey('sumOfTimeDuration')(summaryData) * 1000, '%Hhr %Mm', false)}
        </p>
      </div>
    </div>
  );
};

ShiftSummary.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  comparedData: PropTypes.arrayOf(PropTypes.object),
  shiftWorkingTime: PropTypes.number,
};

ShiftSummary.defaultProps = {
  comparedData: [],
};

export default CSSModules(ShiftSummary, styles);
