import React from 'react';
import moment from 'moment';

import Picker from 'rc-calendar/lib/Picker';
import PropTypes from 'prop-types';
import Calendar from 'rc-calendar';

import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-calendar/assets/index.css';

class DatePicker extends React.PureComponent {
  render() {
    const { disabled, value, onChange, children } = this.props;
    const calendar = (
      <Calendar
        locale={this.props.locale === 'zhcn' ? zhCN : enUS}
        defaultValue={value}
        timePicker={null}
        disabledDate={this.props.disabledDate}
      />
    );

    return (
      <Picker
        animation="slide-up"
        disabled={disabled}
        calendar={calendar}
        value={value}
        onChange={onChange}
      >
        {
          () => (
            children
          )
        }
      </Picker>
    );
  }
}

DatePicker.propTypes = {
  disabled: PropTypes.bool,
  disabledDate: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(moment).isRequired,
  locale: PropTypes.string,
  children: PropTypes.shape({
    type: PropTypes.string,
  }),
};


export default DatePicker;
