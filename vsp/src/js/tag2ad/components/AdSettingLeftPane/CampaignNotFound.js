import React from 'react';
import PropTypes from 'prop-types';
import { Interpolate } from 'react-i18next';
import {
  localize,
} from '../../utils';

class CampaignNotFound extends React.PureComponent {
  state = {
    seconds: 3,
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.state.seconds > 0) {
        this.setState({
          seconds: this.state.seconds - 1,
        });
      } else {
        clearInterval(this.timer);
        this.props.onTimesUp();
      }
    }, 1000);
  }

  render() {
    return (
      <div>
        <Interpolate i18nKey="campaignNotFound" seconds={this.state.seconds} />
      </div>
    );
  }
}

CampaignNotFound.propTypes = {
  t: PropTypes.func,
  onTimesUp: PropTypes.func.isRequired,
  campaignId: PropTypes.number,
};


export default localize(CampaignNotFound);
