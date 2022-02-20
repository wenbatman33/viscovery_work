import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import Modal from 'vidya/Dialogs/Modal';

import CampainForm from './CampainForm';

import styles from './CampaignList.scss';

import TopBar from './TopBar';
import CampaignTable from './CampaignTable';

const firstPage = 1;
const onePageCount = 50;

class CampaignList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.setSearchText = this.setSearchText.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.addFormShow = this.addFormShow.bind(this);
    this.editFormShow = this.editFormShow.bind(this);
    this.reloadCurrentList = this.reloadCurrentList.bind(this);

    this.state = {
      searchText: '',
      currentPage: 1,
    };
  }

  getChildContext() {
    return {
      adHostsList: this.props.adHostsList,
    };
  }

  componentDidMount() {
    this.props.requestCampaigns(firstPage, onePageCount, '');
    this.props.requestIsCampaignExist();
  }

  setSearchText(searchText) {
    this.setState({
      searchText,
    });
  }

  handleSubmitSearch() {
    this.setState({
      currentPage: firstPage,
    });

    this.props.requestCampaigns(firstPage, onePageCount, this.state.searchText);
  }

  handleChangePage(targetPage) {
    this.setState({
      currentPage: targetPage,
    });

    this.props.requestCampaigns(targetPage, onePageCount, this.state.searchText);
  }

  reloadCurrentList() {
    const { currentPage } = this.state;
    this.props.requestCampaigns(currentPage, onePageCount);
  }

  addFormShow = () => {
    this.props.getAdHostsList();
    this.modal.toShow();
    this.modal.switchContent(
      <CampainForm
        newCampaign
        checkCampaignName={this.props.checkCampaignName}
        getAdHostsList={this.props.getAdHostsList}
        addCampaign={this.props.addCampaign}
        formCallback={() => {
          this.modal.toClear();
          this.modal.toHide();
        }}
        cancel={() => {
          this.modal.toClear();
          this.modal.toHide();
        }}
      />
    );
  }

  editFormShow = (campaign) => {
    this.props.getAdHostsList();
    this.modal.toShow();
    this.modal.switchContent(
      <CampainForm
        campaign={campaign}
        checkCampaignName={this.props.checkCampaignName}
        getAdHostsList={this.props.getAdHostsList}
        patchCampaign={this.props.patchCampaign}
        formCallback={() => {
          this.modal.toClear();
          this.modal.toHide();
          this.reloadCurrentList();
        }}
        cancel={() => {
          this.modal.toClear();
          this.modal.toHide();
        }}
      />
    );
  }

  render() {
    const { campaigns, isCampaignExist } = this.props;

    return (
      <div>
        <TopBar
          campaigns={campaigns}
          isCampaignExist={isCampaignExist}
          setSearchText={this.setSearchText}
          handleSubmitSearch={this.handleSubmitSearch}
          currentPage={this.state.currentPage}
          onePageCount={onePageCount}
          totalPageCount={this.props.totalPageCount}
          totalCampaignCount={this.props.totalCampaignCount}
          handleChangePage={this.handleChangePage}
          addCampaign={this.addFormShow}
        />
        <CampaignTable
          campaigns={campaigns}
          onePageCount={onePageCount}
          alert={this.props.alert}
          setMessage={this.props.setMessage}
          showLoading={this.props.showLoading}
          hideLoading={this.props.hideLoading}
          editCampaign={this.editFormShow}
          duplicateCampaign={this.props.duplicateCampaign}
          deleteCampaign={this.props.deleteCampaign}
          modal={this.modal}
          reloadCurrentList={this.reloadCurrentList}
          currentPage={this.state.currentPage}
          handleChangePage={this.handleChangePage}
          requestIsCampaignExist={this.props.requestIsCampaignExist}
          disableExport={this.props.disableExport}
        />
        <Modal
          ref={(modal) => { this.modal = modal; }}
          hideWhenBackground
          headerHide
        />
      </div>
    );
  }
}

CampaignList.childContextTypes = {
  adHostsList: PropTypes.arrayOf(PropTypes.object),
};

CampaignList.propTypes = {
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      campaign_id: PropTypes.number,
    }),
  ),
  isCampaignExist: PropTypes.bool,
  totalPageCount: PropTypes.number,
  totalCampaignCount: PropTypes.number,
  requestCampaigns: PropTypes.func,
  requestIsCampaignExist: PropTypes.func,
  alert: PropTypes.func,
  setMessage: PropTypes.func,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
  checkCampaignName: PropTypes.func,
  getAdHostsList: PropTypes.func,
  addCampaign: PropTypes.func,
  patchCampaign: PropTypes.func,
  editFormShow: PropTypes.func,
  duplicateCampaign: PropTypes.func,
  deleteCampaign: PropTypes.func,
  adHostsList: PropTypes.arrayOf(PropTypes.object),
  disableExport: PropTypes.bool.isRequired,
};

export default CSSModules(CampaignList, styles);
