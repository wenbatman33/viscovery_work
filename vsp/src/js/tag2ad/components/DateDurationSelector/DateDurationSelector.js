import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import { Button } from 'vidya/Button';
import DatePicker from '../DatePicker';
import { localize } from '../../utils';
import styles from './styles.scss';

class DateDurationSelector extends React.PureComponent {
  getStartDate = () => (this.props.startDate ? moment(this.props.startDate) : moment());

  getEndDate = () => (this.props.endDate ? moment(this.props.endDate) : moment());

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
    const now = moment();
    return momentObj.isAfter(now);
  };

  /**
   * Validate if the displayed date should be disabled
   * @param momentObj An instance of moment()
   * @return {*} bool
   */
  isEndDateDisabled = (momentObj) => {
    const now = moment();
    const start = moment(this.getStartDate()).hours(0).minutes(0).seconds(0);

    return momentObj.isBefore(start) || momentObj.isAfter(now);
  };

  notifyChange = (start, end) => {
    if (this.props.onDateChange) {
      const startDate = start ? start.toDate() : start;
      const endDate = end ? end.toDate() : end;
      this.props.onDateChange(startDate, endDate);
    }
  };

  handleTodayBtnClick = () => {
    const now = moment();
    this.notifyChange(now, now);
  };

  handleOneWeekBtnClick = () => {
    const now = moment();
    const sevenDaysAgo = moment().subtract(6, 'days');

    this.notifyChange(sevenDaysAgo, now);
  };

  handleOneMonthBtnClick = () => {
    const now = moment();
    const oneMonthAgo = moment().subtract(1, 'months');

    this.notifyChange(oneMonthAgo, now);
  };

  render() {
    return (
      <div styleName="root">
        <DatePicker
          onChange={this.handleStartDateChange}
          date={this.getStartDate()}
          disabledDate={this.isStartDateDisabled}
        />
        <div styleName="text">
          {this.props.t('to')}
        </div>
        <DatePicker
          onChange={this.handleEndDateChange}
          date={this.getEndDate()}
          disabledDate={this.isEndDateDisabled}
        />
        <div styleName="action-btns">
          <Button
            vdStyle={'secondary'}
            onClick={this.handleTodayBtnClick}
          >
            {this.props.t('today')}
          </Button>
          <Button
            vdStyle={'secondary'}
            onClick={this.handleOneWeekBtnClick}
          >
            {this.props.t('within_1_week')}
          </Button>
          <Button
            vdStyle={'secondary'}
            onClick={this.handleOneMonthBtnClick}
          >
            {this.props.t('within_1_month')}
          </Button>
        </div>
      </div>
    );
  }
}


DateDurationSelector.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  onDateChange: PropTypes.func,
  t: PropTypes.func,
};


export default localize(CSSModules(DateDurationSelector, styles));
