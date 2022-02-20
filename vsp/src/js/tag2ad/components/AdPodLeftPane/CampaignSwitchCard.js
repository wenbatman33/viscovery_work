import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Autocomplete from 'react-autocomplete';
import routerUtil from 'utils/routerUtil';

import { PATH } from '../../constants';
import { localize } from '../../utils';
import styles from './CampaignSwitchCard.scss';

class CampaignSwitchCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      campaignName: '',
      campaign: null,
    };

    this.expandToggle = this.expandToggle.bind(this);
    this.oCamNameInput = this.oCamNameInput.bind(this);
    this.onCamSelect = this.onCamSelect.bind(this);
  }

  onCamSelect(campaignName, campaign) {
    this.setState({
      campaign,
      expanded: false,
    });
    routerUtil.pushHistory(`${PATH.AD_POD_SEARCH}/${campaign.campaign_id}`);
  }

  oCamNameInput(e) {
    this.setState({
      campaignName: e.target.value,
    });
  }

  expandToggle() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { t, allCampaign } = this.props;

    const campaign = this.state.campaign || this.props.campaign;
    const regCamName = new RegExp(this.state.campaignName.toLowerCase());
    const campaigns = allCampaign.filter(cam => cam.name.toLowerCase().match(regCamName));
    const campaignName = campaign ? campaign.name : null;
    return (
      <div>
        <div
          onClick={this.expandToggle}
          styleName={
            this.state.expanded
            ? 'dropDownToggler-expand'
            : 'dropDownToggler'
          }
        >
          <div styleName="toggleTitle">
            <h3
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%',
                overflowX: 'hidden',
              }}
              title={campaignName}
            >
              {campaignName}
            </h3>
          </div>
          {
            !this.state.expanded
            ? <i className="fa fa-angle-down" aria-hidden="true" />
            : <i className="fa fa-angle-up" aria-hidden="true" />
          }
        </div>
        <div styleName={this.state.expanded ? 'dropdown' : 'hidden'}>
          <Autocomplete
            inputProps={{
              placeholder: t('includeWords'),
            }}
            getItemValue={item => item.name}
            items={campaigns}
            renderItem={item =>
              <div>
                {item.name}
              </div>
            }
            wrapperStyle={{
              width: '100%',
              position: 'absolute',
              background: 'white',
            }}
            menuStyle={{
              position: 'relative',
              top: '0',
              left: '0',
              maxHeight: '50vh',
              overflowY: 'auto',
            }}
            open
            value={this.state.campaignName}
            onChange={this.oCamNameInput}
            onSelect={this.onCamSelect}
          />
        </div>
      </div>
    );
  }
}

CampaignSwitchCard.propTypes = {
  campaign: PropTypes.object,
  allCampaign: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func.isRequired,
};


export default localize(CSSModules(CampaignSwitchCard, styles));
