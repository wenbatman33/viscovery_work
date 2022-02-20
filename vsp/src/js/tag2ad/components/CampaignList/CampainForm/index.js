import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import moment from 'moment';
import Autocomplete from 'react-autocomplete';

import Button from 'vidya/Button/Button';
import { TextInput } from 'vidya/Form';

import { routerUtil } from 'utils';

import { PATH } from '../../../constants';
import {
  localize,
} from '../../../utils';

import DateTimeDurationSelector from '../../DateTimeDurationSelector';
import styles from './CampainForm.scss';


let nameDebounce = null;
let adHostDebounce = null;

const dateTimeValid = (startDate, endDate) => {
  const minEnd = moment(startDate).add(6, 'hours');
  return minEnd.isSameOrBefore(endDate);
};

class CampainForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onAdHostInput = this.onAdHostInput.bind(this);
    this.onAdHostSelect = this.onAdHostSelect.bind(this);
    this.getAllvalid = this.getAllvalid.bind(this);
    this.addCampaign = this.addCampaign.bind(this);
    this.patchCampaign = this.patchCampaign.bind(this);
    this.handleLoading = this.handleLoading.bind(this);
    this.setCampaignNameInvalid = this.setCampaignNameInvalid.bind(this);

    this.state = {
      startDate: moment('00:00', 'HH:mm').add(15, 'days'),
      endDate: moment('00:00', 'HH:mm').add(30, 'days'),
      campaignName: '',
      adHost: '',
      loading: false,
      campaignNameInvalid: false,
      adHostsList: [],
    };
  }

  componentWillMount() {
    if (this.props.campaign) {
      const { name, start_time, end_time, ad_host } = this.props.campaign;
      this.setState({
        campaignName: name,
        startDate: moment.unix(start_time),
        endDate: moment.unix(end_time),
        adHost: ad_host,
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.adHostsList) {
      this.setState({
        adHostsList: nextContext.adHostsList,
      });
    }
  }

  onNameChange(campaignName) {
    if (nameDebounce) {
      clearTimeout(nameDebounce);
      nameDebounce = null;
    }
    if (campaignName.trim() !== '') {
      nameDebounce = setTimeout(() => {
        this.props.checkCampaignName(campaignName)
        .then((campaigns) => {
          const equals = campaigns.filter((campaign) => {
            if (this.props.newCampaign) {
              return (campaign.name === campaignName);
            }
            return (campaign.name === campaignName && this.props.campaign.name !== campaignName);
          });
          if (equals.length > 0) {
            this.setCampaignNameInvalid(true);
          }
        });
      }, 400);
    }
    this.setCampaignNameInvalid(false);

    this.setState({
      campaignName,
    });
  }

  onAdHostInput(e) {
    const searchStr = e.target.value;
    if (adHostDebounce) {
      clearTimeout(adHostDebounce);
      adHostDebounce = null;
    }

    adHostDebounce = setTimeout(() => {
      this.props.getAdHostsList(searchStr);
    }, 400);

    this.setState({
      adHost: searchStr,
    });
  }

  onAdHostSelect(adHost) {
    this.setState({
      adHost,
    });
  }

  setCampaignNameInvalid(campaignNameInvalid) {
    this.setState({
      campaignNameInvalid,
    });
  }

  getAllvalid() {
    const { campaignName, adHost, startDate, endDate, campaignNameInvalid } = this.state;
    return (!campaignNameInvalid
      && campaignName !== ''
      && adHost !== ''
      && startDate.isValid()
      && endDate.isValid()
      && dateTimeValid(startDate, endDate));
  }

  addCampaign() {
    const { campaignName, adHost, startDate, endDate } = this.state;
    this.handleLoading(true);
    this.props.addCampaign({
      start_time: startDate.unix(),
      end_time: endDate.unix(),
      name: campaignName,
      ad_host: adHost,
    }).then((id) => {
      this.handleLoading(false);
      this.props.formCallback();
      return routerUtil.pushHistory(`${PATH.CHANCE_SEARCH}/${id}`);
    })
    .catch(() => this.handleLoading(false));
  }

  patchCampaign() {
    const { campaignName, adHost, startDate, endDate } = this.state;
    const { campaign_id } = this.props.campaign;
    this.handleLoading(true);
    this.props.patchCampaign(campaign_id, {
      start_time: startDate.unix(),
      end_time: endDate.unix(),
      name: campaignName,
      ad_host: adHost,
    })
    .then(() => {
      this.handleLoading(false);
      this.props.formCallback();
    })
    .catch(() => this.handleLoading(false));
  }

  handleLoading(loading) {
    this.setState({
      loading,
    });
  }

  handleDateChange = (startDate, endDate) => {
    this.setState({
      startDate,
      endDate,
    });
  };

  render() {
    const { cancel, newCampaign, t } = this.props;
    const { loading, campaignNameInvalid, adHostsList } = this.state;
    const regadHost = new RegExp(this.state.adHost.toLowerCase());
    const hostsList = adHostsList.filter(host => host.name.toLowerCase().match(regadHost));

    return (
      <div styleName="container">
        <div styleName="content">
          <div styleName="header">
            <h2>{newCampaign ? t('add_campaign') : t('edit_campaign')}</h2>
          </div>
          <div styleName="row">
            <label htmlFor="campaignName">{t('campaign_name')}*</label>
            <TextInput
              id="campaignName"
              invalid={campaignNameInvalid}
              invalidMessage={t('campaign_name_duplicated')}
              value={this.state.campaignName}
              placeholder={t('typein_campaign_name')}
              onChange={this.onNameChange}
            />
          </div>
          <div styleName="row">
            <label htmlFor="campaignOwner">{t('ad_host')}*</label>
            <div styleName="adHostAutoComplete">
              <Autocomplete
                inputProps={{
                  id: 'campaignOwner',
                  placeholder: t('typein_ad_host'),
                }}
                getItemValue={item => item.name}
                items={hostsList}
                renderItem={item =>
                  <div>
                    {item.name}
                  </div>
                }
                menuStyle={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                }}
                value={this.state.adHost}
                onChange={this.onAdHostInput}
                onSelect={this.onAdHostSelect}
              />
            </div>
          </div>
          <div styleName="row">
            <label htmlFor="campaignOwner">{t('campaign_period')}*</label>
            <DateTimeDurationSelector
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onDateChange={this.handleDateChange}
            />
            {
              dateTimeValid(this.state.startDate, this.state.endDate)
              ? null
              : <p styleName="timeWarning">*{t('campaign_period_rule')}</p>
            }
          </div>
        </div>
        <div styleName="footer">
          <Button
            vdSize="normal"
            vdStyle="secondary"
            onClick={cancel}
          >{t('cancel')}</Button>
          {
            newCampaign
            ? <Button
              vdSize="normal"
              vdStyle="primary"
              onClick={this.addCampaign}
              disable={!this.getAllvalid() || loading}
            >
              {t('addNew')}
            </Button>
            : <Button
              vdSize="normal"
              vdStyle="primary"
              onClick={this.patchCampaign}
              disable={!this.getAllvalid() || loading}
            >
              {t('save')}
            </Button>
          }
        </div>
      </div>
    );
  }
}

CampainForm.contextTypes = {
  adHostsList: PropTypes.arrayOf(PropTypes.object),
};

CampainForm.propTypes = {
  cancel: PropTypes.func,
  newCampaign: PropTypes.bool,
  startDate: PropTypes.instanceOf(moment),
  endDate: PropTypes.instanceOf(moment),
  checkCampaignName: PropTypes.func,
  getAdHostsList: PropTypes.func,
  addCampaign: PropTypes.func,
  patchCampaign: PropTypes.func,
  formCallback: PropTypes.func,
  t: PropTypes.func,
  campaign: PropTypes.shape({
    campaign_id: PropTypes.number,
    name: PropTypes.string,
    start_time: PropTypes.number,
    end_time: PropTypes.number,
    ad_host: PropTypes.string,
  }),
};

export default localize(CSSModules(CampainForm, styles));
