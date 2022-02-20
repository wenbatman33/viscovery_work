import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import DatePicker from '../DatePicker';
import TimeField from '../TimeField';
import { localize } from '../../utils';
import styles from './styles.scss';

class DateTimeDurationSelector extends React.PureComponent {
  getStartDate = () => moment(this.props.startDate ? this.props.startDate : moment());

  getEndDate = () => moment(this.props.endDate ? this.props.endDate : moment());

  handleStartDateChange = (momentObj) => {
    if (momentObj) {
      this.notifyChange(momentObj, this.getEndDate());
    }
  };

  handleEndDateChange = (momentObj) => {
    if (momentObj) {
      this.notifyChange(this.getStartDate(), momentObj);
    }
  };

  /**
   * Validate if the displayed date should be disabled
   * @param momentObj An instance of moment()
   * @return {*} bool
   */
  isStartDateDisabled = (momentObj) => {
    const end = this.getEndDate().hours(0).minutes(0).seconds(0);
    return momentObj.isAfter(end);
  };

  /**
   * Validate if the displayed date should be disabled
   * @param momentObj An instance of moment()
   * @return {*} bool
   */
  isEndDateDisabled = (momentObj) => {
    const start = this.getStartDate().hours(0).minutes(0).seconds(0);
    return momentObj.isBefore(start);
  };

  notifyChange = (start, end) => {
    if (this.props.onDateChange) {
      this.props.onDateChange(start, end);
    }
  };

  render() {
    return (
      <div styleName="root">
        <div styleName="date">
          <DatePicker
            onChange={this.handleStartDateChange}
            date={this.getStartDate()}
            disabledDate={this.isStartDateDisabled}
          />
        </div>
        <div styleName="time">
          <TimeField
            time={this.getStartDate()}
            onChange={this.handleStartDateChange}
          />
        </div>
        <div styleName="text">
          {this.props.t('to')}
        </div>
        <div styleName="date">
          <DatePicker
            onChange={this.handleEndDateChange}
            date={this.getEndDate()}
            disabledDate={this.isEndDateDisabled}
          />
        </div>
        <div styleName="time">
          <TimeField
            time={this.getEndDate()}
            onChange={this.handleEndDateChange}
          />
        </div>
      </div>
    );
  }
}


DateTimeDurationSelector.propTypes = {
  startDate: PropTypes.instanceOf(moment),
  endDate: PropTypes.instanceOf(moment),
  onDateChange: PropTypes.func,
  t: PropTypes.func,
};


export default localize(CSSModules(DateTimeDurationSelector, styles));
