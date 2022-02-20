import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';
import { Modal } from 'vidya/Dialogs';

import { NAME } from '../../constants';
import styles from './ModelTabs.scss';

import AlertForm from './UploadCsv/AlertForm';
import ImportingForm from './UploadCsv/ImportingForm';
import DuplicateBrandsForm from './UploadCsv/DuplicateBrandsForm';

const faceModelId = 1;
const objectModelId = 6;
const sceneModelId = 7;
const tagModelId = 8;
const adcModelId = 9;

const modelurlTabMapping = (tabNum) => {
  const rimsUrlPrefix = `/${NAME}/models/`;
  switch (tabNum) {
    case faceModelId: return rimsUrlPrefix + faceModelId;
    case objectModelId: return rimsUrlPrefix + objectModelId;
    case sceneModelId: return rimsUrlPrefix + sceneModelId;
    case tagModelId: return rimsUrlPrefix + tagModelId;
    case adcModelId: return rimsUrlPrefix + adcModelId;
    default: return null;
  }
};

const getModelIdByWebUrl = (webUrl) => {
  if (webUrl !== undefined && webUrl.indexOf('models/' > -1)) {
    const modelIdIndex = webUrl.indexOf('models/') + 'models/'.length;
    return parseInt(webUrl.charAt(modelIdIndex), 10);
  }

  return -1;
};

class ModelTabs extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickTab = this.handleClickTab.bind(this);
    this.handleEnterSearchText = this.handleEnterSearchText.bind(this);
    this.handleClickMultiCreate = this.handleClickMultiCreate.bind(this);
    this.submitMultiCreate = this.submitMultiCreate.bind(this);
    this.clickAddBrand = this.clickAddBrand.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);

    this.state = {
      currentTab: getModelIdByWebUrl(this.props.tabUrl.pathname),
      searchText: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentTab: getModelIdByWebUrl(nextProps.tabUrl.pathname),
    });

    if (nextProps.isImporting) {
      this.importingModal.toShow();
      this.importingModal.switchContent(
        (<ImportingForm />)
      );
    } else {
      this.importingModal.toHide();
    }

    if (nextProps.duplicateBrands.length > 0) {
      this.importingModal.toHide();
      this.duplicateBrandsModal.toShow();
      this.duplicateBrandsModal.switchContent((
        <DuplicateBrandsForm
          duplicateBrands={nextProps.duplicateBrands}
          onClickOkay={() => this.handleClickDupBrandsOkayBtn()}
        />
      ));
    }

    if (nextProps.isCsvUploadIllegal) {
      this.alertCsvIllegalModal.toShow();
      this.alertCsvIllegalModal.switchContent(
        (
          <AlertForm
            modalInstance={this.alertCsvIllegalModal}
            dispatchCancelModal={this.props.clearCsvUploadIllegal}
          >
            {nextProps.t('illegalCsvUploaded')}
          </AlertForm>
        )
      );
    }
  }

  handleClickTab(tabNum) {
    routerUtil.pushHistory(modelurlTabMapping(tabNum));
    this.setState({
      currentTab: tabNum,
    });
  }

  handleEnterSearchText(event) {
    this.setState({
      searchText: event.target.value.trim(),
    });
  }

  handleClickMultiCreate(event) {
    event.preventDefault();
    event.stopPropagation();

    this.uploadMulti.click();
  }

  submitMultiCreate(e) {
    const event = e;
    event.preventDefault();
    event.stopPropagation();

    const files = [];
    for (const file of event.target.files) {
      files.push(file);
    }

    this.props.uploadCsv(files[0]);
    event.target.value = null;
  }

  handleClickDupBrandsOkayBtn() {
    this.duplicateBrandsModal.toHide();
    this.props.clearDupBrands();
  }

  clickAddBrand(event) {
    event.preventDefault();
    event.stopPropagation();

    this.props.openAddBrand();
  }

  handleSubmitSearch(event) {
    // Prevent page refresh for form onSubmit
    event.preventDefault();

    const searchObj = {
      searchText: this.state.searchText,
      searchTab: this.state.currentTab,
    };
    this.props.submitSearchText(searchObj);
  }

  render() {
    const { t } = this.props;
    return (
      <div styleName="rims-nav">
        <div styleName="tabs-container">
          <div styleName={`${this.state.currentTab === faceModelId ? 'tab-active' : 'tab'}`} onClick={() => this.handleClickTab(faceModelId)}>
            {t('Face')}
          </div>
          <div styleName={`${this.state.currentTab === objectModelId ? 'tab-active' : 'tab'}`} onClick={() => this.handleClickTab(objectModelId)}>
            {t('Object')}
          </div>
          <div styleName={`${this.state.currentTab === sceneModelId ? 'tab-active' : 'tab'}`} onClick={() => this.handleClickTab(sceneModelId)}>
            {t('Scene')}
          </div>
          <div styleName={`${this.state.currentTab === tagModelId ? 'tab-active' : 'tab'}`} onClick={() => this.handleClickTab(tagModelId)}>
            {t('Tag')}
          </div>
          <div styleName={`${this.state.currentTab === adcModelId ? 'tab-active' : 'tab'}`} onClick={() => this.handleClickTab(adcModelId)}>
            {t('ADC')}
          </div>
        </div>
        <div>
          <form
            styleName="search-form"
            onSubmit={this.handleSubmitSearch}
          >
            <input
              type="text"
              styleName="search-input"
              placeholder={t('searchBox')}
              onChange={this.handleEnterSearchText}
            />
            <button type="submit" styleName="submit-btn">
              <i className="fa fa-search" aria-hidden="true" />
            </button>
          </form>
          <Button vdStyle="secondary" style={{ marginLeft: '16px' }} onClick={this.handleClickMultiCreate}>
            {t('multiAddBrand')}
          </Button>
          <input
            styleName="hide-input"
            type="file"
            accept=".csv"
            ref={(node) => { this.uploadMulti = node; }}
            onChange={this.submitMultiCreate}
          />
          <Button vdStyle="secondary" style={{ marginLeft: '8px' }} onClick={this.clickAddBrand}>
            {t('addBrand')}
          </Button>
        </div>
        <Modal
          headerHide
          hideWhenBackground
          ref={(modal) => { this.importingModal = modal; }}
        />
        <Modal
          headerHide
          hideWhenBackground
          ref={(modal) => { this.duplicateBrandsModal = modal; }}
        />
        <Modal
          headerHide
          hideWhenBackground
          ref={(modal) => { this.alertCsvIllegalModal = modal; }}
        />
      </div>
    );
  }
}

ModelTabs.propTypes = {
  t: PropTypes.func,
  tabUrl: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  submitSearchText: PropTypes.func,
  uploadCsv: PropTypes.func,
  isImporting: PropTypes.bool,
  isUploadCsvSuccess: PropTypes.bool,
  isCsvUploadIllegal: PropTypes.bool,
  duplicateBrands: PropTypes.arrayOf(PropTypes.shape({
    vsp_id: PropTypes.string,
  })),
  clearDupBrands: PropTypes.func,
  openAddBrand: PropTypes.func,
  clearCsvUploadIllegal: PropTypes.func,
};

export default translate([NAME])(CSSModules(ModelTabs, styles));
