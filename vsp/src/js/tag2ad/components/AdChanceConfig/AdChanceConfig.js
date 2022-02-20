import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { localize } from '../../utils';
import {
  AD_CHANCE_SPACE_UNIT as UNIT_OPTIONS,
  START_DURATION_PERCENTGE,
  END_DURATION_PERCENTAGE,
} from '../../constants';

import IntervalInput from './IntervalInput';
import DurationInput from './DurationInput';
import LimitInput from './LimitInput';

import styles from './styles.scss';
import * as helper from './helper';

class AdChanceConfig extends React.Component {


  componentWillUnmount() {
    const { config } = this.props;

    if (config && config.duration && config.duration.unit === UNIT_OPTIONS.PERCENTAGE) {
      const { start, end, unit } = config.duration;
      if (!start && end) {
        this.handleDurationChange(
          String(START_DURATION_PERCENTGE),
          end,
          unit,
          config.valid.duration,
        );
      }

      if (start && !end) {
        this.handleDurationChange(
          start,
          String(END_DURATION_PERCENTAGE),
          unit,
          config.valid.duration,
        );
      }
    }
  }

  setDurationTime = (start, end, unit, valid) => {
    const nextConfig = Object.assign({}, helper.EMPTY_CONFIG, this.props.config);
    nextConfig.duration.start = start;
    nextConfig.duration.end = end;
    nextConfig.duration.unit = unit;
    nextConfig.valid.duration = valid;

    return nextConfig;
  };

  setInterval = (second, valid) => {
    const nextConfig = Object.assign({}, helper.EMPTY_CONFIG, this.props.config);
    nextConfig.interval = second;
    nextConfig.valid.interval = valid;

    return nextConfig;
  };

  setLimit = (nextLimit, valid) => {
    const nextConfig = Object.assign({}, helper.EMPTY_CONFIG, this.props.config);
    nextConfig.limit = nextLimit;
    nextConfig.valid.limit = valid;

    return nextConfig;
  };

  handleLimitChange = (limit, valid) => {
    const nextConfig = this.setLimit(limit, valid);

    if (this.props.onChange) {
      this.props.onChange(nextConfig);
    }
  };

  handleIntervalChange = (second, valid) => {
    const nextConfig = this.setInterval(second, valid);

    if (this.props.onChange) {
      this.props.onChange(nextConfig);
    }
  };

  handleDurationChange = (start, end, unit, valid) => {
    const nextConfig = this.setDurationTime(start, end, unit, valid);
    const isEmpty = helper.isDurationEmpty(nextConfig);

    if (isEmpty) {
      nextConfig.duration.unit = null;
    }

    if (this.props.onChange) {
      this.props.onChange(nextConfig);
    }
  };

  render() {
    const { config } = this.props;

    return (
      <div styleName="root">
        <IntervalInput
          value={helper.getIntervalSecond(config)}
          onChange={this.handleIntervalChange}
        />
        <LimitInput
          value={helper.getLimit(config)}
          onChange={this.handleLimitChange}
        />
        <DurationInput
          start={helper.getDurationStart(config)}
          end={helper.getDurationEnd(config)}
          unit={helper.getDurationUnit(config)}
          onValueChange={this.handleDurationChange}
        />
      </div>
    );
  }
}

AdChanceConfig.propTypes = {
  config: PropTypes.shape({
    interval: PropTypes.string,
    limit: PropTypes.string,
    duration: PropTypes.shape({
      unit: PropTypes.oneOf([...Object.values(UNIT_OPTIONS)]),
      start: PropTypes.string,
      end: PropTypes.string,
    }),
    valid: PropTypes.shape({
      interval: PropTypes.bool,
      limit: PropTypes.bool,
      duration: PropTypes.bool,
    }),
  }),
  onChange: PropTypes.func,
  t: PropTypes.func,
};


export default localize(CSSModules(AdChanceConfig, styles));
