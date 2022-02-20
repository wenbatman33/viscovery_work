import PropTypes from 'prop-types';
import React from 'react';
import { TextInput } from 'vidya/Form';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import DatePicker from '../DatePicker';
import * as helper from './helper';
import styles from './IntervalPicker.scss';

class IntervalPicker extends React.PureComponent {

  handleStartDateChange = (date) => {
    if (this.props.onStartChange) {
      this.props.onStartChange(date);
    }
  };

  handleEndDateChange = (date) => {
    if (this.props.onEndChange) {
      this.props.onEndChange(date);
    }
  };

  isEndDateDisabled = (date) => {
    const now = moment();
    return date.isBefore(this.props.startDate) || date.isAfter(now);
  };

  isStartDateDisabled = (date) => {
    const now = moment();
    return date.isAfter(now);
  };

  render() {
    const { startDate, endDate } = this.props;

    return (
      <div styleName="root">
        <TextInput
          value={helper.dateToString(startDate.toDate())}
          readOnly
        />
        <DatePicker
          value={startDate}
          onChange={this.handleStartDateChange}
          locale={this.props.locale}
          disabledDate={this.isStartDateDisabled}
        >
          <i className="fa fa-calendar" aria-hidden="true" styleName="icon" />
        </DatePicker>
        <div styleName="connector"> - </div>
        <TextInput
          value={helper.dateToString(endDate.toDate())}
          readOnly
        />
        <DatePicker
          onChange={this.handleEndDateChange}
          value={endDate}
          locale={this.props.locale}
          disabledDate={this.isEndDateDisabled}
        >
          <i className="fa fa-calendar" aria-hidden="true" styleName="icon" />
        </DatePicker>
      </div>
    );
  }
}

IntervalPicker.propTypes = {
  locale: PropTypes.string,
  startDate: PropTypes.instanceOf(moment).isRequired,
  endDate: PropTypes.instanceOf(moment).isRequired,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func,
};

export default CSSModules(IntervalPicker, styles);
