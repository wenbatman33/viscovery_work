import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { HorizontalDivider } from 'vidya';

import PercentageDuration from './PercentageDuration';
import TimeDuration from './TimeDuration';
import { AD_CHANCE_SPACE_UNIT as OPTIONS } from '../../constants';

import styles from './styles.scss';

import * as helper from './helper';
import { localize } from '../../utils';

class DurationInput extends React.PureComponent {

  state = {
    startValidation: {
      typeInvalid: false,
      percentGT100: false,
    },
    endValidation: {
      typeInvalid: false,
      percentGT100: false,
    },
    isStartGTEnd: false,
  };

  componentDidMount() {
    this.validate(this.props.unit, this.props.start, this.props.end);
  }

  componentWillReceiveProps(nextProps) {
    this.validate(nextProps.unit, nextProps.start, nextProps.end);
  }

  validate = (unit, start, end) => {
    const nextState = nextValidateState(unit, start, end);

    this.setState(nextState);
    return nextState;
  };

  handleStartChange = (value, unit) => {
    const isValid = isAllValid(
      nextValidateState(this.props.unit, value, this.props.end)
    );
    this.props.onValueChange(value, this.props.end, unit, isValid);
  };

  handleEndChange = (value, unit) => {
    const isValid = isAllValid(
      nextValidateState(this.props.unit, this.props.start, value)
    );
    this.props.onValueChange(this.props.start, value, unit, isValid);
  };

  render() {
    const isPercentageDisabled = this.props.unit === OPTIONS.TIME;
    const isTimeDisabled = this.props.unit === OPTIONS.PERCENTAGE;

    return (
      <div>
        <PercentageDuration
          start={
            !isPercentageDisabled ?
              this.props.start :
              ''
          }
          end={
            !isPercentageDisabled ?
              this.props.end :
              ''
          }
          disabled={isPercentageDisabled}
          onStartChange={(value) => {
            this.handleStartChange(value, OPTIONS.PERCENTAGE);
          }}
          onEndChange={(value) => {
            this.handleEndChange(value, OPTIONS.PERCENTAGE);
          }}
          startInvalid={
            !isPercentageDisabled &&
            !isStartValid(this.state)
          }
          endInvalid={
            !isPercentageDisabled &&
            !isEndValid(this.state)
          }
          isStartGTEnd={
            !isPercentageDisabled &&
            this.state.isStartGTEnd
          }
          typeInvalid={
            !isPercentageDisabled &&
            isTypeInvalid(this.state)
          }
          isGT100={
            !isPercentageDisabled &&
            isGT100(this.state)
          }
          placeholder={'%'}
        />
        <HorizontalDivider />
        <TimeDuration
          start={
            !isTimeDisabled ?
              this.props.start :
              ''
          }
          end={
            !isTimeDisabled ?
              this.props.end :
              ''
          }
          disabled={isTimeDisabled}
          onStartChange={(value) => {
            this.handleStartChange(value, OPTIONS.TIME);
          }}
          onEndChange={(value) => {
            this.handleEndChange(value, OPTIONS.TIME);
          }}
          startInvalid={
            !isTimeDisabled &&
            !isStartValid(this.state)
          }
          endInvalid={
            !isTimeDisabled &&
            !isEndValid(this.state)
          }
          typeInvalid={
            !isTimeDisabled &&
            isTypeInvalid(this.state)
          }
          placeholder={this.props.t('minute')}
        />
      </div>
    );
  }
}

const isStartValid = state => (
  Object.values(state.startValidation).every(k => k === false) &&
  !state.isStartGTEnd
);

const isEndValid = state => (
  Object.values(state.endValidation).every(k => k === false) &&
  !state.isStartGTEnd
);

const isTypeInvalid = state => (
  state.startValidation.typeInvalid || state.endValidation.typeInvalid
);

const isGT100 = state => (
  state.startValidation.percentGT100 || state.endValidation.percentGT100
);

const isAllValid = state => isStartValid(state) && isEndValid(state);

const nextValidateState = (unit, start, end) => {
  const startTypeValid = helper.inputPositiveCheck(start);
  const endTypeValid = helper.inputPositiveCheck(end);
  const isUnitPercentage = unit === OPTIONS.PERCENTAGE;

  const nextState = {
    startValidation: {
      typeInvalid: !startTypeValid,
      percentGT100: isUnitPercentage && startTypeValid && helper.isGT100(start),
    },
    endValidation: {
      typeInvalid: !endTypeValid,
      percentGT100: isUnitPercentage && endTypeValid && helper.isGT100(end),
    },
    isStartGTEnd: (
      isUnitPercentage &&
      startTypeValid &&
      endTypeValid &&
      helper.isStartGTEnd(start, end)
    ),
  };

  return nextState;
};


DurationInput.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  unit: PropTypes.oneOf([
    OPTIONS.PERCENTAGE,
    OPTIONS.TIME,
  ]),
  onValueChange: PropTypes.func,
  t: PropTypes.func,
};


export default localize(CSSModules(DurationInput, styles));
