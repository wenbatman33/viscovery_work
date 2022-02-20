import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import moment from 'moment';
import { routerUtil } from 'utils';

import { PATH } from '../../../constants';
import {
  adsApi,
} from '../../../api';

import {
  localize,
  invokeDownloadWindow,
} from '../../../utils';

import DeleteConfirm from '../DeleteConfirm';

import styles from './CampaignTable.scss';

const dateParse = date => moment.unix(date).format('YYYY/MM/DD HH:mm');

const forwardAdManage = campaignId => routerUtil.pushHistory(`${PATH.AD_POD_SEARCH}/${campaignId}`);

class CampaignTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.renderInitialTable = this.renderInitialTable.bind(this);
    this.renderDataTable = this.renderDataTable.bind(this);
    this.handleCampaignExport = this.handleCampaignExport.bind(this);
    this.showToastMessage = this.showToastMessage.bind(this);
    this.handleDownloadCampaign = this.handleDownloadCampaign.bind(this);
    this.handleDuplicate = this.handleDuplicate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleCampaignExport(campaignId) {
    const successHandler = () => {
      this.showToastMessage(this.props.t('publishSuccess'));
    };
    const failHandler = () => {
      this.props.alert(this.props.t('publishFailMessage'));
    };

    adsApi.exportAds(campaignId, true)
      .then(successHandler, failHandler);
  }

  showToastMessage(message, time = 3000) {
    if (message) {
      this.props.setMessage(message);
      setTimeout(() => {
        this.props.setMessage(null);
      }, time);
    }
  }

  handleDownloadCampaign(campaignId) {
    if (campaignId) {
      const successHandler = (res) => {
        this.props.hideLoading();
        const downloadLink = res.response_data.download_link;
        const fileName = downloadLink.split('/').pop() || 'vad.zip';
        invokeDownloadWindow(downloadLink, fileName);
      };

      const failHandler = () => {
        this.props.hideLoading();
        this.props.alert(this.props.t('downloadFailed'));
      };


      this.props.showLoading(this.props.t('processingPleaseWait'));
      adsApi.downloadAds(campaignId, true)
        .then(successHandler, failHandler);
    }
  }

  handleDuplicate(campaignId) {
    this.props.showLoading(this.props.t('processingPleaseWait'));
    this.props.duplicateCampaign(campaignId)
    .then(() => {
      this.props.hideLoading();
      this.props.reloadCurrentList();
      this.showToastMessage(this.props.t('duplicate_campaign_complete'));
    }, (err) => {
      this.props.hideLoading();
      this.props.alert(`${this.props.t('duplicate_campaign_fail')} - ${err.response_msg}`);
    });
  }

  handleDelete(campaignId) {
    const {
      campaigns,
      currentPage,
      handleChangePage,
      requestIsCampaignExist,
      reloadCurrentList,
    } = this.props;

    const modal = this.props.modal;
    modal.toShow();
    modal.switchContent(
      <DeleteConfirm
        deleteCallback={() => {
          modal.toClear();
          modal.toHide();
          this.props.showLoading(this.props.t('processingPleaseWait'));
          this.props.deleteCampaign(campaignId)
          .then(() => {
            this.props.hideLoading();
            this.showToastMessage(this.props.t('delete_campaign_complete'));

            if (campaigns.length > 1) reloadCurrentList();
            else if (currentPage - 1 > 0) handleChangePage(currentPage - 1);
            else {
              requestIsCampaignExist();
              reloadCurrentList();
            }
          }, (err) => {
            this.props.hideLoading();
            this.props.alert(`${this.props.t('delete_campaign_fail')} - ${err.response_msg}`);
          });
        }}
        cancel={() => {
          modal.toClear();
          modal.toHide();
        }}
      />
    );
  }

  // eslint-disable-next-line
  renderInitialTable(t) {
    return (
      <div>
        <div styleName="header-table">
          <div styleName="col0" />
          <div styleName="col1">
            {t('campaign_name')}
          </div>
          <div styleName="col2">
            {t('ad_host')}
          </div>
          <div styleName="col3">
            {t('campaign_period')}
          </div>
          <div styleName="col4">
            {t('adPod_count')}
          </div>
          <div styleName="col5" />
        </div>
        <div styleName="content-table">
          <div styleName="center-msg">
            <div style={{ marginTop: '39px' }}>
              {t('no_campaign_exist')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line
  renderDataTable(campaigns, t) {
    const { currentPage, onePageCount } = this.props;
    return (
      <table styleName="data-table">
        <thead styleName="data-thead">
          <tr>
            <th />
            <th>{t('campaign_name')}</th>
            <th>{t('ad_host')}</th>
            <th>{t('campaign_period')}</th>
            <th>{t('adPod_count')}</th>
            <th />
          </tr>
        </thead>
        <tbody styleName="data-tbody">
          {
            campaigns.map((campaignObj, index) => (
              <tr key={campaignObj.campaign_id}>
                <td>{ ((currentPage - 1) * onePageCount) + index + 1 }</td>
                <td
                  styleName="campaign-name"
                  title={campaignObj.name}
                  onClick={() => forwardAdManage(campaignObj.campaign_id)}
                >
                  { campaignObj.name }
                </td>
                <td>{ campaignObj.ad_host }</td>
                <td>{ dateParse(campaignObj.start_time) } - { dateParse(campaignObj.end_time) }</td>
                <td>{ campaignObj.number_of_ads }</td>
                <td>
                  <div styleName="action-container">
                    <div tabIndex="0" styleName="dot-btn">
                      <i className="fa fa-ellipsis-h" aria-hidden="true" styleName="dot-icon">
                        <div styleName="drop-container">
                          <p
                            styleName="drop-item"
                            onClick={() => this.props.editCampaign(campaignObj)}
                          >
                            {t('edit')}
                          </p>
                          <p
                            styleName="drop-item"
                            onClick={() => this.handleDuplicate(campaignObj.campaign_id)}
                          >
                            {t('copy')}
                          </p>
                          {
                            !this.props.disableExport ?
                              (
                                <p
                                  styleName={`${campaignObj.number_of_ads === 0 ? 'disabled-drop-item' : 'drop-item'}`}
                                  onClick={() => {
                                    if (campaignObj.number_of_ads > 0) {
                                      this.handleCampaignExport(campaignObj.campaign_id);
                                    }
                                  }}
                                >
                                  {t('export')}
                                </p>
                              )
                              :
                              null
                          }
                        </div>
                      </i>
                    </div>
                    <div
                      styleName="action-btn"
                      onClick={() =>
                        this.handleDelete(campaignObj.campaign_id)}
                    >
                      {t('delete')}
                    </div>
                    <div
                      styleName={`${campaignObj.number_of_ads === 0 ? 'disabled-action-btn' : 'action-btn'}`}
                      onClick={() => {
                        if (campaignObj.number_of_ads > 0) {
                          this.handleDownloadCampaign(campaignObj.campaign_id);
                        }
                      }}
                    >
                      {t('download')}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }

  render() {
    const { campaigns, t } = this.props;

    return (
      campaigns.length === 0 ? this.renderInitialTable(t) : this.renderDataTable(campaigns, t)
    );
  }
}

CampaignTable.propTypes = {
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      campaign_id: PropTypes.number,
    }),
  ),
  onePageCount: PropTypes.number,
  alert: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  t: PropTypes.func,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
  editCampaign: PropTypes.func,
  duplicateCampaign: PropTypes.func,
  deleteCampaign: PropTypes.func,
  reloadCurrentList: PropTypes.func,
  modal: PropTypes.object,
  currentPage: PropTypes.number,
  handleChangePage: PropTypes.func,
  requestIsCampaignExist: PropTypes.func,
  disableExport: PropTypes.bool,
};

export default localize(CSSModules(CampaignTable, styles));
