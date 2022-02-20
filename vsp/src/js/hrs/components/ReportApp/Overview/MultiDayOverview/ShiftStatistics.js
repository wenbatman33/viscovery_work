import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import humanize from 'humanize';
import routerUtil from 'utils/routerUtil';
import {
  msToString,
} from 'utils/timeUtil';

import styles from './ShiftStatistics.scss';

const colWidths = {
  shiftName: '10%',
  workTime: '30%',
  tagCount: '30%',
  efficiency: '20%',
  detailLink: '10%',
};

const Header = () => (
  <div
    style={{
      marginBottom: '38px',
    }}
  >
    <div
      styleName="header"
      style={{
        width: colWidths.shiftName,
        textAlign: 'left',
      }}
    />
    <div
      styleName="header"
      style={{
        width: colWidths.workTime,
        textAlign: 'center',
      }}
    >
      <p>
        總工時
      </p>
    </div>
    <div
      styleName="header"
      style={{
        width: colWidths.tagCount,
        textAlign: 'center',
      }}
    >
      <p>
        操作標籤
      </p>
    </div>
    <div
      styleName="header"
      style={{
        width: colWidths.efficiency,
        textAlign: 'center',
      }}
    >
      <p>
        每小時人均標籤
      </p>
    </div>
    <div
      styleName="header"
      style={{
        width: colWidths.detailLink,
        textAlign: 'right',
      }}
    />
  </div>
);

const WrappedHeader = CSSModules(Header, styles);

const handleEfficiency = num => humanize.numberFormat(num, 0);
const handleTagCount = num => humanize.numberFormat(num, 0);

class Row extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDetailClick = this.handleDetailClick.bind(this);
  }

  handleDetailClick() {
    const { shiftId } = this.props;
    const path = this.context.location.pathname.replace('overview', 'shift');
    routerUtil.pushHistory(`${path}/${shiftId}${this.context.location.search}`);
  }

  render() {
    const { shiftName, sumOfTimeDuration, count, efficiency, efficiencyGoal } = this.props;
    return (
      <div>
        <div
          styleName="content"
          style={{
            width: colWidths.shiftName,
            textAlign: 'left',
          }}
        >
          <p
            style={{
              fontWeight: 'bold',
            }}
          >
            {shiftName}
          </p>
        </div>
        <div
          styleName="content"
          style={{
            width: colWidths.workTime,
            textAlign: 'center',
          }}
        >
          <p
            styleName="content__text"
          >
            {msToString(sumOfTimeDuration * 1000, '%Hhr %Mm', false)}
          </p>
        </div>
        <div
          styleName="content"
          style={{
            width: colWidths.tagCount,
            textAlign: 'center',
          }}
        >
          <p
            styleName="content__text"
          >
            {handleTagCount(count)}
          </p>
        </div>
        <div
          styleName="content"
          style={{
            width: colWidths.efficiency,
            textAlign: 'center',
            color: efficiencyGoal > efficiency ? '#EB5757' : null,
          }}
        >
          <p
            styleName="content__text"
          >
            {handleEfficiency(efficiency)}
          </p>
        </div>
        <div
          styleName="detail__link"
          style={{
            width: colWidths.detailLink,
            textAlign: 'right',
          }}
        >
          <p
            style={{
              cursor: 'pointer',
            }}
            onClick={this.handleDetailClick}
          >
            細節列表
          </p>
        </div>
      </div>
    );
  }
}

Row.propTypes = {
  shiftName: PropTypes.string,
  sumOfTimeDuration: PropTypes.number,
  count: PropTypes.number,
  efficiency: PropTypes.number,
  efficiencyGoal: PropTypes.number,
  shiftId: PropTypes.string,
};

Row.contextTypes = {
  location: PropTypes.object,
};

const WrappedRow = CSSModules(Row, styles);

const ShiftStatistics = ({ data }) => (
  <div
    style={{
      background: 'white',
      padding: '40px 32px',
      marginBottom: '16px',
    }}
  >
    <WrappedHeader />
    {
      data.map(ele =>
        <WrappedRow
          key={ele.shiftId}
          shiftName={ele.shiftName}
          count={ele.count}
          efficiency={ele.count / (ele.sumOfTimeDuration / 3600)}
          sumOfTimeDuration={ele.sumOfTimeDuration}
          efficiencyGoal={ele.efficiencyGoal}
          shiftId={ele.shiftId}
        />
      )
    }
  </div>
);

ShiftStatistics.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default CSSModules(ShiftStatistics, styles);
