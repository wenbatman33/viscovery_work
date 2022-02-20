import React from 'react';
import PropTypes from 'prop-types';

import LeftPaneCard from '../LeftPaneCard';
import {
  GeneralCardPlaceholder,
} from '../AdSettingLeftPane';

import {
  dateToString,
  localize,
} from '../../utils';

class TimeCard extends React.Component {

  render() {
    const { startDate, endDate } = this.props;
    return (
      <LeftPaneCard
        title={this.props.t('time')}
        onExpandChange={() => {
          this.props.onExpandChange(this.props.eventKey);
        }}
        expanded={this.props.expanded}
        hideBorder
      >
        {
          startDate || endDate ?
            (
              <GeneralCardPlaceholder
                text={`${dateToString(startDate)} - ${dateToString(endDate)}`}
              />
            ) :
            (
              <GeneralCardPlaceholder
                text={this.props.t('pleaseChooseUpdatedTime')}
              />
            )
        }
      </LeftPaneCard>
    );
  }
}

TimeCard.propTypes = {
  t: PropTypes.func,
  eventKey: PropTypes.number.isRequired,
  onExpandChange: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
};


export default localize(TimeCard);
