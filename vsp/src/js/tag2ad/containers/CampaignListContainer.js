import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'vidya/LoadingBar';
import {
  setMessage,
  showAlert,
  requestCampaignsCreator,
  requestIsCampaignExistCreator,
  checkCampaignName,
  getAdHostsList,
  addCampaign,
  patchCampaign,
  duplicateCampaign,
  deleteCampaign,
} from '../actions';

import {
  getCampaigns,
  isCampaignExist,
  getPageCount,
  getCampaignCount,
  getAdHosts,
  disableExportAds,
} from '../selectors';

import CampaignList from '../components/CampaignList';

const mapStateToProps = state => ({
  campaigns: getCampaigns(state),
  isCampaignExist: isCampaignExist(state),
  totalPageCount: getPageCount(state),
  totalCampaignCount: getCampaignCount(state),
  adHostsList: getAdHosts(state),
  disableExport: disableExportAds(state),
});

const mapDispatchToProps = dispatch => ({
  alert: message => dispatch(showAlert(message)),
  setMessage: message => dispatch(setMessage(message)),
  requestCampaigns: (...params) => dispatch(requestCampaignsCreator(...params)),
  requestIsCampaignExist: (...params) => dispatch(requestIsCampaignExistCreator(...params)),
  showLoading: message => dispatch(showLoading(message)),
  hideLoading: () => dispatch(hideLoading()),
  addCampaign: data => addCampaign(data),
  patchCampaign: (campaignId, data) => patchCampaign(campaignId, data),
  duplicateCampaign: campaignId => duplicateCampaign(campaignId),
  deleteCampaign: campaignId => deleteCampaign(campaignId),
  getAdHostsList: name => dispatch(getAdHostsList(name)),
  checkCampaignName: name => checkCampaignName(name),
});

const CampaignListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CampaignList);

export default CampaignListContainer;
