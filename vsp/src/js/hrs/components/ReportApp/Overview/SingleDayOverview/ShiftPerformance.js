import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import routerUtil from 'utils/routerUtil';

import styles from './ShiftPerformance.scss';

import ShiftSummary from './ShiftSummary';
import StackedBarChart from '../../common/StackedBarChart';


import {
  byUsername,
  reduceRecordForModels,
} from '../../utils';

const recordTemplate = {
  1: 0,
  6: 0,
  7: 0,
};

const keys = ['1', '6', '7'];

const groupbyAssigneeId = R.groupBy(byUsername);

const mapDataForModels = groupData => R.map(
  ele => ele.reduce(reduceRecordForModels, {}),
  groupData
);

const flattenData = data => Object.keys(data).map(username => ({
  username,
  ...data[username],
}));

const inRecordTemplate = data => data.map(ele => ({
  ...recordTemplate,
  ...ele,
}));

const handleDataForChart = R.compose(
  inRecordTemplate,
  flattenData,
  mapDataForModels,
  groupbyAssigneeId
);

class ShiftPerformance extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDetailClick = this.handleDetailClick.bind(this);
  }

  handleDetailClick() {
    const path = this.context.location.pathname.replace('overview', 'shift');
    routerUtil.pushHistory(`${path}/${this.props.shiftId}${this.context.location.search}`);
  }

  render() {
    const { data, comparedData, shiftName, shiftWorkingTime, workGoal } = this.props;

    return (
      <div styleName="container">
        <div
          styleName="wrapper"
        >
          <h2>{ `${shiftName}產量` }</h2>
          <p
            styleName="detail__link"
            onClick={this.handleDetailClick}
          >
            細節列表
          </p>
          <div
            style={{
              marginTop: '34px',
              marginBottom: '32px',
            }}
          >
            <ShiftSummary
              shiftWorkingTime={shiftWorkingTime}
              data={data}
              comparedData={comparedData}
            />
          </div>
          <div
            style={{
              height: '300px',
            }}
          >
            <StackedBarChart
              data={handleDataForChart(data)}
              workGoal={workGoal}
              keys={keys}
              marginTop={20}
              marginRight={20}
              marginBottom={30}
              marginLeft={40}
            />
          </div>
        </div>
      </div>
    );
  }
}

ShiftPerformance.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  comparedData: PropTypes.arrayOf(PropTypes.object),
  shiftName: PropTypes.string,
  shiftId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  workGoal: PropTypes.number,
  shiftWorkingTime: PropTypes.number,
};

ShiftPerformance.contextTypes = {
  location: PropTypes.object,
};

export default CSSModules(ShiftPerformance, styles);
