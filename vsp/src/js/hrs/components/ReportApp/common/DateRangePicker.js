import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import { Button } from 'vidya/Button';
import FAIcon from 'vidya/Freddicons/FAIcon';

import routerUtil from 'utils/routerUtil';
import {
  bindQueryString,
} from 'utils/urlUtil';

import styles from './DateRangePicker.scss';

const momentToString = momentObject =>
  momentObject.format('YYYYMMDD');

const momentToDisplayString = momentObject =>
  momentObject.format('YYYY/MM/DD');

const handleDisplay = (since, to) =>
  (
    since === to ?
      `${momentToDisplayString(moment(since))}` :
      `${momentToDisplayString(moment(since))} ~ ${momentToDisplayString(moment(to))}`
  );


class DateRangePicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleState = this.handleState.bind(this);

    this.state = {
      since: props.since ? moment(props.since) : moment().subtract(1, 'days'),
      to: props.to ? moment(props.to) : moment().subtract(1, 'days'),
      stage: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.since !== nextProps.since) this.handleState('since')(moment(nextProps.since));
    if (this.props.to !== nextProps.to) this.handleState('to')(moment(nextProps.to));
  }

  handleState(key) {
    return value => this.setState({
      [key]: value,
    });
  }

  render() {
    switch (this.state.stage) {
      case 0:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <h3 styleName="display">
              {handleDisplay(moment(this.state.since).format('YYYYMMDD'), moment(this.state.to).format('YYYYMMDD'))}
            </h3>
            <Button
              vdStyle={'secondary'}
              vdSize={'normal'}
              onClick={() => {
                this.handleState('stage')(1);
              }}
              style={{
                marginLeft: '0',
              }}
            >
              修改
            </Button>
          </div>
        );
      case 1:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div>
              <DatePicker
                dateFormat="YYYY/MM/DD"
                maxDate={this.state.to}
                selected={this.state.since}
                onChange={this.handleState('since')}
                className={styles.input}
              />
              <FAIcon
                className={styles.icon}
                faClassName="fa-calendar"
              />
            </div>
            <p
              styleName="connect"
            >
              到
            </p>
            <div>
              <DatePicker
                dateFormat="YYYY/MM/DD"
                minDate={this.state.since}
                selected={this.state.to}
                onChange={this.handleState('to')}
                className={styles.input}
              />
              <FAIcon
                className={styles.icon}
                faClassName="fa-calendar"
              />
            </div>
            <div
              style={{
                marginLeft: '16px',
                marginRight: '32px',
              }}
            >
              <Button
                vdStyle={'secondary'}
                vdSize={'normal'}
                onClick={() => {
                  this.handleState('since')(moment().subtract(1, 'day'));
                  this.handleState('to')(moment().subtract(1, 'day'));
                }}
                style={{
                  marginLeft: '0',
                  borderTopRightRadius: '0',
                  borderBottomRightRadius: '0',
                }}
              >
                最近一天
              </Button>
              <Button
                vdStyle={'secondary'}
                vdSize={'normal'}
                onClick={() => {
                  this.handleState('since')(moment().subtract(1, 'weeks').startOf('week'));
                  this.handleState('to')(moment().subtract(1, 'weeks').endOf('week'));
                }}
                style={{
                  marginLeft: '0',
                  borderRadius: '0',
                }}
              >
                近一工作週
              </Button>
              <Button
                vdStyle={'secondary'}
                vdSize={'normal'}
                onClick={() => {
                  this.handleState('since')(moment().subtract(1, 'months').startOf('month'));
                  this.handleState('to')(moment().subtract(1, 'months').endOf('month'));
                }}
                style={{
                  marginLeft: '0',
                  borderTopLeftRadius: '0',
                  borderBottomLeftRadius: '0',
                }}
              >
                最近一個月份
              </Button>
            </div>
            <Button
              vdStyle={'primary'}
              vdSize={'normal'}
              onClick={() => {
                const { query, pathname } = this.context.location;
                const bindQS = bindQueryString(pathname);
                const mergedQuery = {
                  ...query,
                  since: momentToString(this.state.since),
                  to: momentToString(this.state.to),
                };
                routerUtil.pushHistory(bindQS(mergedQuery));
                this.handleState('stage')(0);
              }}
              style={{
                marginLeft: '0',
              }}
            >
              套用
            </Button>
          </div>
        );
      default:
        return null;
    }
  }
}

DateRangePicker.propTypes = {
  since: PropTypes.string,
  to: PropTypes.string,
};

DateRangePicker.contextTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
  }),
};

export default CSSModules(DateRangePicker, styles);
