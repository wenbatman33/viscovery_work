import React from 'react';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import CalendarPicker from './CalendarPicker';

import styles from './styles.scss';

class DatePicker extends React.PureComponent {

  render() {
    return (
      <CalendarPicker
        onChange={(momentObj) => {
          this.props.onChange(momentObj);
        }}
        value={this.props.date}
        disabledDate={this.props.disabledDate}
      >
        <div styleName="picker">
          <div styleName="date">
            {this.props.date.format('YYYY/MM/DD')}
          </div>
          <i className="fa fa-calendar" aria-hidden="true" />
        </div>
      </CalendarPicker>
    );
  }
}

DatePicker.propTypes = {
  date: React.PropTypes.instanceOf(moment),
  onChange: React.PropTypes.func.isRequired,
  disabledDate: React.PropTypes.func,
};


export default CSSModules(DatePicker, styles);
