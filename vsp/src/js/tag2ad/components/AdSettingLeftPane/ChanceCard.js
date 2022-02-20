import React from 'react';
import PropTypes from 'prop-types';

import LeftPaneCard from '../LeftPaneCard';
import GeneralCardPlaceholder from './GeneralCardPlaceholder';
import {
  isObjectEmpty,
  localize,
} from '../../utils';

import { helper } from '../AdChanceConfig';

import ChanceConfigContent from './ChanceConfigContent';

const showPlaceholder = (config) => {
  if (isObjectEmpty(config)) {
    return true;
  }

  return (
    helper.isIntervalEmpty(config) &&
    helper.isLimitEmpty(config) &&
    helper.isDurationEmpty(config)
  );
};

class ChanceCard extends React.PureComponent {
  render() {
    return (
      <LeftPaneCard
        eventKey={this.props.eventKey}
        title={this.props.t('adChangeConfig')}
        onExpandChange={() =>
          this.props.onExpandChange(this.props.eventKey)
        }
        expanded={this.props.expanded}
        hideBorder
      >
        {
          showPlaceholder(this.props.config) ?
            <GeneralCardPlaceholder
              text={this.props.t('emptyChanceCardPlaceholder')}
            /> :
            <ChanceConfigContent
              chanceConfig={this.props.config}
            />
        }
      </LeftPaneCard>
    );
  }
}

ChanceCard.propTypes = {
  eventKey: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  onExpandChange: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  config: PropTypes.shape({
    interval: PropTypes.string,
    limit: PropTypes.string,
    duration: PropTypes.shape({
      unit: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
    }),
  }),
};


export default localize(ChanceCard);
