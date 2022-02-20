import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { LogUtil } from 'utils';
import { campaignApi } from '../../api';
import styles from './CampaignInfo.scss';

class CampaignInfo extends React.PureComponent {
  state = {
    campaign: null,
  };

  componentDidMount() {
    this.requestCampaign(this.props.campaignId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.campaignId !== this.props.campaignId) {
      this.setState({
        campaign: null,
      }, () => {
        this.requestCampaign(nextProps.campaignId);
      });
    }
  }


  requestCampaign = (id) => {
    if (id) {
      campaignApi.getCampaign(id)
        .then((res) => {
          this.setState({
            campaign: res.response_data,
          });
        })
        .catch((ex) => {
          if (ex.response && ex.response.status === 404) {
            if (this.props.onNotFound) {
              this.props.onNotFound(id);
            }
          }
          LogUtil.log(`Request campaign:${id} failed, ex=${ex}`);
        });
    }
  };

  render() {
    return (
      <div styleName="container">
        {
          this.state.campaign ?
            (
              <div
                styleName="name"
                title={this.state.campaign.name}
              >
                {this.state.campaign.name}
              </div>
            ) :
            (
              <div styleName="placeholder" />
            )
        }
      </div>
    );
  }
}

CampaignInfo.propTypes = {
  campaignId: PropTypes.number.isRequired,
  onNotFound: PropTypes.func,
};


export default CSSModules(CampaignInfo, styles);
