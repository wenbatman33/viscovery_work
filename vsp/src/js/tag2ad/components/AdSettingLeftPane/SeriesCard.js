import React from 'react';
import PropTypes from 'prop-types';
import { Interpolate } from 'react-i18next';

import LeftPaneCard from '../LeftPaneCard';
import GeneralCardPlaceholder, { divStyle } from './GeneralCardPlaceholder';
import { localize } from '../../utils';

const InfoComponent = ({ count }) => (
  <span
    style={{
      color: '#17ABFF',
    }}
  >
    {count}
  </span>
);

InfoComponent.propTypes = {
  count: PropTypes.number,
};

class SeriesCard extends React.Component {

  render() {
    return (
      <LeftPaneCard
        eventKey={this.props.eventKey}
        title={this.props.t('chooseSeries')}
        onExpandChange={() =>
          this.props.onExpandChange(this.props.eventKey)
        }
        expanded={this.props.expanded}
        hideBorder
      >
        {
          this.props.count && this.props.count > 0 ?
            <div
              style={divStyle}
            >
              <Interpolate
                i18nKey="numOfVideosSelected"
                count={<InfoComponent count={this.props.count} />}
              />
            </div>
            :
            <GeneralCardPlaceholder
              text={this.props.placeholder}
            />
        }
      </LeftPaneCard>
    );
  }
}

SeriesCard.propTypes = {
  eventKey: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  onExpandChange: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  count: PropTypes.number,
  placeholder: PropTypes.string,
};


export default localize(SeriesCard);
