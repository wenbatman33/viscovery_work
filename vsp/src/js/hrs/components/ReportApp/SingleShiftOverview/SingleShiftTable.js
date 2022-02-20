import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import humanize from 'humanize';

import {
  sumWithKey,
} from 'utils/mathUtil';

import {
  msToString,
} from 'utils/timeUtil';

import routerUtil from 'utils/routerUtil';

import styles from './SingleShiftTable.scss';

const byAssigneeId = record => record.assignee_id;

const groupbyAssigneeId = R.groupBy(byAssigneeId);

const handleDataByUsername = R.compose(
  groupbyAssigneeId
);

const findModelId = modelId => R.find(R.propEq('model_id', modelId));

const getCount = R.propOr(0, 'count');

const handelModelCount = modelId => R.compose(
  getCount,
  findModelId(modelId),
);

class SingleShiftTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDetailClick = this.handleDetailClick.bind(this);
  }

  handleDetailClick(id) {
    routerUtil.pushHistory(`/hrs/report/personal/${id}${this.context.location.search}`);
  }

  render() {
    const { groupbyReports, efficiencyGoal } = this.props;
    const data = handleDataByUsername(groupbyReports);
    const getEfficency = key =>
      (sumWithKey('count')(data[key]) / sumWithKey('sum_of_time_duration')(data[key])) * 3600;

    return (
      <div styleName="container">
        <div styleName="header">
          <div styleName="header-col">
            <p>操作員ID</p>
          </div>
          <div styleName="header-col">
            <p>實際工時</p>
          </div>
          <div styleName="header-col">
            <p>標籤操作數</p>
          </div>
          <div styleName="header-col">
            <p>Face</p>
          </div>
          <div styleName="header-col">
            <p>Object</p>
          </div>
          <div styleName="header-col">
            <p>Scene</p>
          </div>
          <div styleName="header-col">
            <p>每小時平均標籤數</p>
          </div>
        </div>
        {Object.keys(data).map(key =>
          <div
            key={key}
            styleName="content"
          >
            <div styleName="content-col">
              <p
                styleName="detail__link"
                onClick={() => {
                  this.handleDetailClick(data[key][0].assignee_id);
                }}
              >{data[key][0].username}</p>
            </div>
            <div styleName="content-col">
              <p>{msToString(sumWithKey('sum_of_time_duration')(data[key]) * 1000, '%Hhr %Mm', false)}</p>
            </div>
            <div styleName="content-col">
              <p>{ humanize.numberFormat(sumWithKey('count')(data[key]), 0)}</p>
            </div>
            <div styleName="content-col">
              <p>{humanize.numberFormat(handelModelCount(1)(data[key]), 0)}</p>
            </div>
            <div styleName="content-col">
              <p>{humanize.numberFormat(handelModelCount(6)(data[key]), 0)}</p>
            </div>
            <div styleName="content-col">
              <p>{humanize.numberFormat(handelModelCount(7)(data[key]), 0)}</p>
            </div>
            <div styleName="content-col">
              <p
                style={{
                  color: efficiencyGoal > getEfficency(key) ? '#EB5757' : null,
                }}
              >
                {humanize.numberFormat(getEfficency(key), 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

SingleShiftTable.propTypes = {
  groupbyReports: PropTypes.arrayOf(PropTypes.object),
  efficiencyGoal: PropTypes.number,
};

SingleShiftTable.contextTypes = {
  location: PropTypes.object,
};

export default CSSModules(SingleShiftTable, styles);
