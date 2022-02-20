import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import humanize from 'humanize';
import {
  sumByProps,
} from 'utils/mathUtil';

import styles from './SummaryCard.scss';

import {
  reduceRecordForSum,
} from '../../utils';

const titleMap = {
  total: '總標籤操作',
  1: 'Face',
  6: 'Object',
  7: 'Scene',
};

const byModel = ele => ele.model_id;

const groupbyModel = R.groupBy(byModel);

const mapDataForAssignee = groupData => R.map(
  ele => ele.reduce(reduceRecordForSum, {}),
  groupData
);

const handleDataForShift = R.compose(
  ele => ([
    R.compose(
      R.set(R.lensProp('modelId'), 'total'),
      sumByProps(['count', 'delete', 'confirm', 'label', 'modify', 'sumOfTimeDuration'])
    )(ele),
    ...ele,
  ]),
  R.map(ele => ({
    ...ele[1],
    modelId: ele[0],
  })),
  R.toPairs,
  mapDataForAssignee,
  groupbyModel
);

const SummaryCard = ({ data }) => {
  const summaryData = handleDataForShift(data);
  return (
    <div styleName="container">
      <h2
        style={{
          marginBottom: '32px',
        }}
      >
        總產量
      </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {
          summaryData.map(e =>
            <div
              styleName="block"
              key={e.modelId}
            >
              <p
                styleName="block__title"
              >
                {titleMap[e.modelId]}
              </p>
              <p
                styleName="block__number"
              >
                {humanize.numberFormat(e.count, 0)}
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
};

SummaryCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default CSSModules(SummaryCard, styles);
