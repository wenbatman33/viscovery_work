import PropTypes from 'prop-types';
import 'rc-calendar/assets/index.css';
import React from 'react';
import 'rc-time-picker/assets/index.css';
import CSSModules from 'react-css-modules';
import moment from 'moment';

import Picker from './Picker';
import styles from './main.scss';

const format = 'YYYY-MM-DD HH:mm:ss';


function getFormat(time) {
  return time ? format : 'YYYY-MM-DD';
}

const SHOW_TIME = false;

class RangeCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startValue: null,
      endValue: null,
    };
    this.onChange = this.onChange.bind(this);
    this.disabledEndDate = this.disabledEndDate.bind(this);
    this.disabledStartDate = this.disabledStartDate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startValue !== '') {
      this.setState({ startValue: moment(nextProps.startValue) });
    }

    if (nextProps.endValue !== '') {
      this.setState({ endValue: moment(nextProps.endValue) });
    }
  }

  onChange(field) {
    return (value) => {
      this.setState({
        [field]: value,
      });
      if (field === 'startValue') {
        this.props.startVal(value ? `${value.format(getFormat(SHOW_TIME))} 00:00:00` : '');
      } else if (field === 'endValue') {
        this.props.endVal(value ? `${value.format(getFormat(SHOW_TIME))} 00:00:00` : '');
      }
    };
  }

  disabledEndDate(endValue) {
    if (!endValue) {
      return false;
    }
    const startValue = this.state.startValue;
    if (!startValue) {
      return false;
    }
    return SHOW_TIME ? endValue.isBefore(startValue) :
    endValue.diff(startValue, 'days') <= 0;
  }

  disabledStartDate(startValue) {
    if (!startValue) {
      return false;
    }
    const endValue = this.state.endValue;
    if (!endValue) {
      return false;
    }
    return SHOW_TIME ? endValue.isBefore(startValue) :
    endValue.diff(startValue, 'days') <= 0;
  }

  render() {
    const state = this.state;
    return (
      <div styleName="inputContainer">
        <div styleName="pickerInput">
          <Picker
            disabledDate={this.disabledStartDate}
            value={state.startValue}
            onChange={this.onChange('startValue')}
          />
        </div>
        <span styleName="seperateWord">到</span>
        <div styleName="pickerInput">
          <Picker
            disabledDate={this.disabledEndDate}
            value={state.endValue}
            onChange={this.onChange('endValue')}
          />
        </div>
      </div>
    );
  }
}

RangeCalendar.propTypes = {
  startVal: PropTypes.func,
  endVal: PropTypes.func,
  startValue: PropTypes.string,
  endValue: PropTypes.string,
};

export default CSSModules(RangeCalendar, styles);
