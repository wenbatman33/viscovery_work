import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import humanize from 'humanize';
import {
  msToString,
} from 'utils/timeUtil';
import routerUtil from 'utils/routerUtil';

import styles from './AssigneePerformance.scss';
import MultiLineChart from '../../common/MultiLineChart';

const defaultZero = R.defaultTo(0);

const reduceData = id => R.compose(
  R.reduce((pV, cV) => ({
    count: defaultZero(pV.count) + defaultZero(cV.count),
    sum_of_time_duration:
    defaultZero(pV.sum_of_time_duration) + defaultZero(cV.sum_of_time_duration),
  }),
  {}),
  R.map(ele => ele.data[id]),
);

const compareCompute = R.compose(
  Math.round,
  number => number * 100,
  (report, goal) => (report - goal) / goal
);

class AssigneePerformance extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDetailClick = this.handleDetailClick.bind(this);
  }

  handleDetailClick() {
    const { keys } = this.props;

    routerUtil.pushHistory(`/hrs/report/personal/${keys[0]}${this.context.location.search}`);
  }

  render() {
    const { data, range, efficiencyGoal, workHours, colorRange, keys, assigneeName } = this.props;
    const sumData = reduceData(keys[0])(data);
    const sumHour = (sumData.sum_of_time_duration / 3600);
    const efficiency = (sumData.count / sumHour);
    const compared = compareCompute(efficiency, efficiencyGoal);

    return (
      <div>
        <div
          styleName="wrapper"
        >
          <h2>{assigneeName}</h2>
          <p
            styleName="detail__link"
            onClick={this.handleDetailClick}
          >
            細節列表
          </p>
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
                {humanize.numberFormat(sumData.count, 0)}
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
                {humanize.numberFormat(efficiency, 0)}
              </p>
              <div>
                <p styleName="compare__prefix">比標準</p>
                {
                  (compared > 0)
                  ? <p styleName="compare__number">
                      +{compared}%
                    </p>
                  : <p styleName="compare_neg_number">
                    {compared}%
                    </p>
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
                工時
              </p>
              <p styleName="block__number">
                {msToString(sumData.sum_of_time_duration * 1000, '%Hhr %Mm %Ss', false)}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {}
            </div>
          </div>
          <div
            style={{
              height: '300px',
            }}
          >
            <MultiLineChart
              data={data}
              workGoal={efficiencyGoal * workHours}
              keys={keys}
              colorRange={colorRange}
              range={range}
              marginTop={20}
              marginRight={20}
              marginBottom={30}
              marginLeft={50}
            />
          </div>
        </div>
      </div>
    );
  }
}

AssigneePerformance.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  range: PropTypes.arrayOf(PropTypes.string),
  efficiencyGoal: PropTypes.number,
  workHours: PropTypes.number,
  keys: PropTypes.arrayOf(PropTypes.string),
  colorRange: PropTypes.arrayOf(PropTypes.string),
  assigneeName: PropTypes.string,
};

AssigneePerformance.contextTypes = {
  location: PropTypes.object,
};

export default CSSModules(AssigneePerformance, styles);
