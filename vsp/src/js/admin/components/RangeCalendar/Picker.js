import 'rc-calendar/assets/index.css';
import React from 'react';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';

import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const cn = location.search.indexOf('cn') !== -1;

function getFormat(time) {
  return time ? format : 'YYYY-MM-DD'; // eslint-disable-line no-undef
}

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = <TimePickerPanel />;

class Picker extends React.Component {
  render() {
    const props = this.props;
    const childStyles = {
      container: {
        width: '100%',
      },
      input: {
        fontSize: '14px',
        height: '38px',
        width: 'calc(100% - 50px)',
        paddingLeft: '8px',
      },
      btn: {
        border: 'thin solid rgba(26, 10, 10, 0.2)',
        height: '38px',
        width: '34px',
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: '7px',
      },
    };
    const calendar = (
      <Calendar
        locale={cn ? zhCN : enUS}
        defaultValue={now}
        timePicker={props.showTime ? timePickerElement : null}
        disabledDate={props.disabledDate}
      />
    );
    return (
      <DatePicker
        animation="slide-up"
        disabled={props.disabled}
        calendar={calendar}
        value={props.value}
        onChange={props.onChange}
      >
        {
          ({ value }) => (
            <span style={childStyles.container}>
              <input
                placeholder="请選擇日期"
                style={childStyles.input}
                disabled={props.disabled}
                readOnly
                value={(value && value.format(getFormat(props.showTime))) || ''}
              />
              <span style={childStyles.btn}>
                <i className="fa fa-calendar" aria-hidden="true" />
              </span>
            </span>
          )
        }
      </DatePicker>
    );
  }
}

export default Picker;
