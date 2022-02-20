import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';

import {
  sumWithKey,
} from 'utils/mathUtil';

import {
  msToString,
} from 'utils/timeUtil';

import styles from './VideoReportTable.scss';

const mapping = {
  1: 'Face',
  6: 'Object',
  7: 'Scene',
};

const getTotalTime = time => msToString(time * 1000, '%Mm %Ss', false);

const VideoReportTable = ({ videoName, brandReports }) => (
  <div styleName="container">
    <div styleName="label">
      <div styleName="col-left">
        <p
          style={{
            marginLeft: '20px',
          }}
        >{videoName}</p>
      </div>
      <div styleName="col-right">
        <p
          style={{
            marginRight: '15px',
          }}
        >
          <span styleName="sumTitle">
          總標籤處理數
          </span>
          {sumWithKey('count')(brandReports)}
        </p>
        <p
          style={{
            marginRight: '15px',
          }}
        >
          <span styleName="sumTitle">
          總工時
          </span>
          {getTotalTime(sumWithKey('sum_of_time_duration')(brandReports))}
        </p>
      </div>
    </div>
    <div styleName="header">
      <div styleName="header-col">
        <p>{}</p>
      </div>
      <div styleName="header-col">
        <p>FITAMOS</p>
      </div>
      <div styleName="header-col">
        <p>Brand</p>
      </div>
      <div styleName="header-col">
        <p>獲得標籤數<br />(機器辨識)</p>
      </div>
      <div styleName="header-col">
        <p>HRS後數量</p>
      </div>
      <div styleName="header-col">
        <p>標籤確認數</p>
      </div>
      <div styleName="header-col">
        <p>標籤刪除數</p>
      </div>
      <div styleName="header-col">
        <p>標籤修改數</p>
      </div>
      <div styleName="header-col">
        <p>標籤鎖定數</p>
      </div>
      <div styleName="header-col">
        <p>處理時數</p>
      </div>
    </div>
    {brandReports.map((data, index) =>
      <div
        key={data.brand_id}
        styleName="content"
      >
        <div styleName="content-col">
          <p>{(index + 1)}</p>
        </div>
        <div styleName="content-col">
          <p>{mapping[data.model_id]}</p>
        </div>
        <div styleName="content-col">
          <p>{data.brand_name}</p>
        </div>
        <div styleName="content-col">
          <p>{data.count}</p>
        </div>
        <div styleName="content-col">
          <p>{data.count - data.delete - data.modify}</p>
        </div>
        <div styleName="content-col">
          <p>{data.confirm}</p>
        </div>
        <div styleName="content-col">
          <p>{data.delete}</p>
        </div>
        <div styleName="content-col">
          <p>{data.modify}</p>
        </div>
        <div styleName="content-col">
          <p>{data.label}</p>
        </div>
        <div styleName="content-col">
          <p>{msToString(data.sum_of_time_duration * 1000, '%Mm %Ss', false)}</p>
        </div>
      </div>
    )}
    <div
      styleName="total"
    >
      <div styleName="content-col">
        <p>{}</p>
      </div>
      <div styleName="content-col">
        <p>Total</p>
      </div>
      <div styleName="content-col">
        <p>{}</p>
      </div>
      <div styleName="content-col">
        <p>{sumWithKey('count')(brandReports)}</p>
      </div>
      <div styleName="content-col">
        <p>{sumWithKey('count')(brandReports) - sumWithKey('delete')(brandReports) - sumWithKey('modify')(brandReports)}</p>
      </div>
      <div styleName="content-col">
        <p>{sumWithKey('confirm')(brandReports)}</p>
      </div>
      <div styleName="content-col">
        <p>{sumWithKey('delete')(brandReports)}</p>
      </div>
      <div styleName="content-col">
        <p>{sumWithKey('modify')(brandReports)}</p>
      </div>
      <div styleName="content-col">
        <p>{sumWithKey('label')(brandReports)}</p>
      </div>
      <div styleName="content-col">
        <p>{getTotalTime(sumWithKey('sum_of_time_duration')(brandReports))}</p>
      </div>
    </div>
  </div>
);

VideoReportTable.propTypes = {
  brandReports: PropTypes.arrayOf(PropTypes.object),
  videoName: PropTypes.string,
};

export default CSSModules(VideoReportTable, styles);
