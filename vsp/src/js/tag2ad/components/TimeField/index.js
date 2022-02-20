import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TextInput } from 'vidya/Form';

class TimeField extends React.Component {
  constructor(props) {
    super(props);

    this.timeChange = this.timeChange.bind(this);
    this.addComma = this.addComma.bind(this);

    this.state = {
      time: '00:00',
      invalid: false,
    };
  }

  componentWillMount() {
    const hour = this.props.time.format('HH');
    const minute = this.props.time.format('mm');
    this.setState({
      time: `${hour}:${minute}`,
    });
  }

  addComma() {
    const { time } = this.state;
    if (!time.includes(':') && time.length === 4) {
      const _time = `${time.substring(0, 2)}:${time.substring(2, 4)}`;
      this.setState({
        time: _time,
      });
    }
  }

  timeChange(_time) {
    let time = _time.replace(/[^0-9:]+/g, '');
    if (time.includes(':')) {
      time = time.substring(0, 5);
    } else {
      time = time.substring(0, 4);
    }
    const valid = /^([0-1][0-9]|2[0-3])(:?)([0-5][0-9])$/.test(time);
    this.setState({
      time,
      invalid: !valid,
    });

    if (valid) {
      let hour;
      let minute;
      if (time.includes(':')) {
        hour = time.substring(0, 2);
        minute = time.substring(3, 5);
      } else {
        hour = time.substring(0, 2);
        minute = time.substring(2, 4);
      }
      this.props.onChange(this.props.time.hour(hour).minute(minute));
    }
  }

  render() {
    const { time, invalid } = this.state;
    return (
      <TextInput
        onChange={this.timeChange}
        onBlur={this.addComma}
        value={time}
        placeholder="12:30"
        invalid={invalid}
      />
    );
  }
}

TimeField.propTypes = {
  time: PropTypes.instanceOf(moment),
  onChange: PropTypes.func,
};

export default TimeField;
