import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import {
  TextInput,
} from 'vidya/Form';

import styles from './ShiftInfoCard.scss';

let goalTimeoutObj;

const validCheck = (val) => {
  if (val === '') return val;

  const value = Number(val);
  if (isNaN(value)) return '';
  if (val.endsWith('.')) return val;

  if (value % 1 !== 0) return value.toFixed(1);

  return value;
};

const maxValid = (key, value) => {
  switch (key) {
    case 'working_hours':
      return value > 8 ? 8 : value;
    case 'working_days' :
      return value > 7 ? 7 : value;
    default:
      return value;
  }
};

const valueValid = key => (value) => {
  const validChecked = validCheck(value);
  const maxChecked = maxValid(key, validChecked);
  return maxChecked;
};

class ShiftInfoCard extends React.PureComponent {
  constructor(props) {
    super(props);

    const { efficiencyGoal, workingHours, workingDays } = this.props;
    this.changeWeekGoal = this.changeWeekGoal.bind(this);
    this.getProps = this.getProps.bind(this);
    this.changeTime = this.changeTime.bind(this);

    this.state = {
      weekGoal: efficiencyGoal * workingHours * workingDays,
    };
  }

  getProps = () => this.props;

  checkEffValid = effGoal => (timePeriod) => {
    const eff = (isNaN(effGoal) || effGoal === Infinity) ? 0 : effGoal;
    const effInt = Math.ceil(eff);
    const { onChange } = this.props;

    if (goalTimeoutObj) {
      clearTimeout(goalTimeoutObj);
    }

    if (effInt !== eff) {
      goalTimeoutObj = setTimeout(() => {
        const props = this.getProps();
        props.onChange('efficiency_goal')(Number(effInt));
        this.setState({ weekGoal: effInt * props.workingHours * props.workingDays });
      }, timePeriod);
    } else {
      setTimeout(() => onChange('efficiency_goal')(Number(eff)), 100);
    }
  }

  changeTime = key => (val) => {
    const { onChange, workingHours, workingDays } = this.props;
    const { weekGoal } = this.state;

    const validValue = valueValid(key)(val);
    onChange(key)(validValue);

    if (weekGoal <= 0 || validValue === '') return;

    const workTime = (key === 'working_hours') ? validValue * workingDays : validValue * workingHours;
    const effGoal = weekGoal / workTime;
    this.checkEffValid(effGoal)(100);
  }

  changeWeekGoal = (val) => {
    const { workingHours, workingDays } = this.props;
    const value = maxValid('work_goal', val);

    this.setState({ weekGoal: value });

    const effGoal = value / (workingHours * workingDays);
    this.checkEffValid(effGoal)(1000);
  };

  render() {
    const {
      hrsShiftName,
      efficiencyGoal,
      workingHours,
      workingDays,
    } = this.props;

    return (
      <div
        style={{
          background: 'white',
          padding: '32px 32px 0 32px',
        }}
      >
        <h2
          styleName="title"
          style={{
            marginBottom: '32px',
          }}
        >
          {hrsShiftName}
        </h2>
        <div styleName="block">
          <p
            styleName="block__title"
          >
            每日標準工時（小時）
          </p>
          <TextInput
            value={String(workingHours)}
            onChange={this.changeTime('working_hours')}
          />
        </div>
        <div styleName="block">
          <p
            styleName="block__title"
          >
            每週標準工作日（天）
          </p>
          <TextInput
            value={String(workingDays)}
            onChange={this.changeTime('working_days')}
          />
        </div>
        <div styleName="block">
          <p
            styleName="block__title"
          >
            週總目標
          </p>
          <TextInput
            value={String(Math.ceil(this.state.weekGoal))}
            onChange={this.changeWeekGoal}
          />
        </div>
        <div styleName="block">
          <p
            styleName="block__title"
          >
            每日建議目標產值
          </p>
          <h2>{Math.ceil(efficiencyGoal * workingHours)}</h2>
        </div>
        <div styleName="block">
          <p
            styleName="block__title"
          >
            每小時建議目標(自動進位至整數)
          </p>
          <h2>{efficiencyGoal}</h2>
        </div>
      </div>
    );
  }
}

ShiftInfoCard.propTypes = {
  hrsShiftId: PropTypes.number,
  hrsShiftName: PropTypes.string,
  efficiencyGoal: PropTypes.number,
  workingHours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  workingDays: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
};

export default CSSModules(ShiftInfoCard, styles);
