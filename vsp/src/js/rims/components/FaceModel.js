import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Interpolate, translate } from 'react-i18next';

import { Button } from 'vidya/Button';
import { Modal } from 'vidya/Dialogs';

import AddBrandForm from './AddBrandForm';
import EditEnableForm from './EditEnableForm';

import { NAME } from '../constants';
import styles from './FaceModel.scss';

const onePageCount = 50;
const searchKey = ['name_zh_tw', 'name', 'name_zh_cn'];

const getShowingItems = (meetSearchTextBrandIds, targetPage) => {
  const targetPageLastItemNum = onePageCount * targetPage;
  const targetPageFstItemNum = targetPageLastItemNum - (onePageCount - 1);
  return meetSearchTextBrandIds.filter((brandId, index) =>
    (index + 1) >= targetPageFstItemNum && (index + 1) <= targetPageLastItemNum
  );
};

const getPageVariables = (meetSearchTextBrandIds, currentPage, brandsData) => {
  const pageVariables = {};
  pageVariables.allCount = meetSearchTextBrandIds.length;
  pageVariables.allPagesCount = Math.ceil(pageVariables.allCount / onePageCount);
  pageVariables.fstItemNumber = (onePageCount * (currentPage - 1)) + 1;
  pageVariables.lastItemNumber =
    (currentPage === pageVariables.allPagesCount) ?
      meetSearchTextBrandIds.length :
      (pageVariables.fstItemNumber + (onePageCount - 1));

  let recognizableCount = 0;
  let inUseCount = 0;
  meetSearchTextBrandIds.forEach((brandId) => {
    if (brandsData[brandId].recognizable === 1) recognizableCount += 1;
    if (brandsData[brandId].in_use === 1) inUseCount += 1;
  });
  pageVariables.recognizableCount = recognizableCount;
  pageVariables.inUseCount = inUseCount;

  return pageVariables;
};

const getClassId = (brandId, brandsData) => {
  const vspId = brandsData[brandId].vsp_id;
  return parseInt(vspId.split('-')[1], 10);
};

const getMeetSearchTextBrandIds = (allBrandIds, brandsData, classesData, searchText) =>
  allBrandIds.filter((brandId) => {
    const isBrandNameMeetSearchText = searchKey.some(key =>
      brandsData[brandId][key].toLowerCase().indexOf(searchText.toLowerCase()) > -1
    );

    const itsClassId = getClassId(brandId, brandsData);
    const isItsClassNameMeetSearchText = searchKey.some(key =>
      classesData[itsClassId][key].toLowerCase().indexOf(searchText.toLowerCase()) > -1
    );

    return isBrandNameMeetSearchText || isItsClassNameMeetSearchText;
  });

const renderItemsCount = (allCount, recognizableCount, inUseCount) => {
  if (allCount === 0) {
    return (<div>
      <Interpolate i18nKey="brandCount" allCount={allCount} />
    </div>);
  }

  return (<div>
    <Interpolate i18nKey="brandCounts" allCount={allCount} recognizableCount={recognizableCount} inUseCount={inUseCount} />
  </div>);
};

const renderPaginationInfo = (showedBrandIds, fstItemNumber, lastItemNumber, allPagesCount) => {
  const textFoundDom = (
    <span>
      <Interpolate i18nKey="paginations" fstItemNumber={fstItemNumber} lastItemNumber={lastItemNumber} allPagesCount={allPagesCount} />
    </span>
  );
  const textNotFoundDom = (
    <span>
      <Interpolate i18nKey="pagination" />
    </span>
  );

  return showedBrandIds.length > 0 ? textFoundDom : textNotFoundDom;
};

const getClassesBrandsInModel = (selectModelId, modelsData, classesData) => {
  let classIds = [];
  const brandIds = [];
  if (modelsData[selectModelId] !== undefined) {
    classIds = modelsData[selectModelId].classes;
    modelsData[selectModelId].classes.forEach((classId) => {
      brandIds.push(...classesData[classId].brands);
    });
  }

  return { classIds, brandIds };
};

const isBrandSameAsClass = (classObj, brandObj) => {
  const nameProperties = ['name', 'name_zh_cn', 'name_zh_tw'];
  return !nameProperties.some(nameProperty => classObj[nameProperty] !== brandObj[nameProperty]);
};

class FaceModel extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangePage = this.handleChangePage.bind(this);
    this.getModelData = this.getModelData.bind(this);
    this.handleEditBrandEnable = this.handleEditBrandEnable.bind(this);
    this.handleEditBrandInfo = this.handleEditBrandInfo.bind(this);
    this.handleCloseEditBrandModal = this.handleCloseEditBrandModal.bind(this);
    this.showSuccessStyle = this.showSuccessStyle.bind(this);

    this.state = {
      paginationObj: {
        1: {
          currentPage: 1,
        },
        6: {
          currentPage: 1,
        },
        7: {
          currentPage: 1,
        },
        8: {
          currentPage: 1,
        },
        9: {
          currentPage: 1,
        },
      },
      editBrandBtnClicked: false,
    };
  }

  componentDidMount() {
    this.getModelData();
  }

  componentWillReceiveProps(nextProps) {
    const selectModelId = parseInt(nextProps.match.params.modelId, 10);

    const prevModelSearchText = this.props.searchObj[selectModelId].searchText;
    const nextModelSearchText = nextProps.searchObj[selectModelId].searchText;
    if (prevModelSearchText !== nextModelSearchText) {
      const newPaginationObj = this.state.paginationObj;
      newPaginationObj[selectModelId].currentPage = 1;

      this.setState({
        newPaginationObj,
      });
    }

    if (nextProps.showAddBrandModal) {
      const {
        classIds,
        brandIds,
      } = getClassesBrandsInModel(selectModelId, nextProps.modelsData, nextProps.classesData);

      this.addBrandModal.toShow();
      this.addBrandModal.switchContent(
        (<AddBrandForm
          modelId={selectModelId}
          classIds={classIds}
          brandIds={brandIds}
          classesData={nextProps.classesData}
          brandsData={nextProps.brandsData}
          dispatchCancelModal={nextProps.cancelAddBrandModal}
          submitForm={nextProps.submitAddBrand}
          addBrandFailedList={nextProps.addBrandFailedList}
          clearAddFailedBrand={nextProps.clearAddFailedBrand}
        />)
      );
    } else if (!nextProps.showAddBrandModal) {
      this.addBrandModal.toHide();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.editBrandBtnClicked === true) {
      this.editBrandInfoModal.toShow();
      this.editBrandInfoModal.switchContent(
        <AddBrandForm
          brandData={nextState.editedBrandData}
          classIds={nextState.classIds}
          brandIds={nextState.brandIds}
          classesData={nextState.classesData}
          brandsData={nextState.brandsData}
          submitForm={nextProps.submitEditBrand}
          closeEditBrandModal={this.handleCloseEditBrandModal}
          editBrandFailedList={nextProps.editBrandFailedList}
        />
      );
    }
  }

  getModelData() {
    const classInUse = 'all';
    const brandInUse = 'all';
    this.props.requestModelData(classInUse, brandInUse);
  }

  handleChangePage(selectModelId, targetPage) {
    const newPaginationObj = this.state.paginationObj;
    newPaginationObj[selectModelId].currentPage = targetPage;

    this.setState({
      newPaginationObj,
    });
  }

  handleEditBrandEnable(brandData) {
    this.editBrandEnableModal.toShow();
    this.editBrandEnableModal.switchContent(
      (<EditEnableForm
        brandData={brandData}
        submitForm={this.props.submitEditBrand}
        closeModal={this.editBrandEnableModal.toHide}
      />)
    );
  }

  handleEditBrandInfo(brandData, classIds, brandIds, classesData, brandsData) {
    this.setState({
      editBrandBtnClicked: true,
      editedBrandData: brandData,
      classIds,
      brandIds,
      classesData,
      brandsData,
    });
  }

  handleCloseEditBrandModal() {
    this.setState({
      editBrandBtnClicked: false,
    });
    this.editBrandInfoModal.toHide();
    this.props.clearEditBrandFailedList();
  }

  showSuccessStyle(currentBrandId) {
    const { isSomeBrandsSuccess, successStyleBrand } = this.props;
    if (Array.isArray(successStyleBrand)) {
      return successStyleBrand.some(successBrand => successBrand.id === currentBrandId);
    }

    return isSomeBrandsSuccess && successStyleBrand.id === currentBrandId;
  }

  render() {
    const { t } = this.props;
    const selectModelId = parseInt(this.props.match.params.modelId, 10);
    const { modelsData, classesData, brandsData } = this.props;
    const { classIds, brandIds } = getClassesBrandsInModel(selectModelId, modelsData, classesData);

    const currentModelSearchText = this.props.searchObj[selectModelId].searchText;
    const meetSearchTextBrandIds =
      currentModelSearchText.length > 0 ?
        getMeetSearchTextBrandIds(brandIds, brandsData, classesData, currentModelSearchText) :
        brandIds;

    const currentModelPageNum = this.state.paginationObj[selectModelId].currentPage;
    const {
      allCount,
      allPagesCount,
      fstItemNumber,
      lastItemNumber,
      recognizableCount,
      inUseCount,
    } = getPageVariables(meetSearchTextBrandIds, currentModelPageNum, brandsData);
    const showedBrandIds = getShowingItems(meetSearchTextBrandIds, currentModelPageNum);

    return (
      <div>
        <Modal headerHide hideWhenBackground ref={(modal) => { this.addBrandModal = modal; }} />
        <div styleName="root">
          {renderItemsCount(allCount, recognizableCount, inUseCount)}
          <div>
            {renderPaginationInfo(showedBrandIds, fstItemNumber, lastItemNumber, allPagesCount)}
            <Button vdStyle="secondary" style={{ marginLeft: '8px' }} disable={currentModelPageNum === 1} onClick={() => this.handleChangePage(selectModelId, currentModelPageNum - 1)}>
              <i className="fa fa-angle-left" />
            </Button>
            <Button vdStyle="secondary" style={{ marginLeft: '8px' }} disable={allPagesCount === currentModelPageNum || allPagesCount === 0} onClick={() => this.handleChangePage(selectModelId, currentModelPageNum + 1)}>
              <i className="fa fa-angle-right" />
            </Button>
          </div>
        </div>
        <div styleName={`${this.props.isUploadCsvSuccess === true ? 'csv-bar' : 'init-csv-bar'}`}>
          <i className="fa fa-check" styleName="success-icon" aria-hidden="true" />
          {t('addBrandSuccess')}
        </div>
        <h2 styleName={`${showedBrandIds.length === 0 ? 'text-not-found' : 'hide-text-not-found'}`}>沒有符合的搜尋結果</h2>
        <table styleName={`${showedBrandIds.length > 0 ? 'rims-table' : 'hide-rims-table'}`}>
          <thead styleName="rims-thead">
            <tr>
              <th />
              <th>Class
                <br />{t('brandLocales')}
              </th>
              <th>Brand
                <br />{t('brandLocales')}
              </th>
              <th>
                {t('vspId')}
              </th>
              <th>
                {t('memo')}
              </th>
              <th>
                {t('createTime')}
              </th>
              <th>
                {t('enableRecognize')}
              </th>
              <th>
                {t('enableInUse')}
              </th>
              <th>
                {t('edit')}
              </th>
            </tr>
          </thead>
          <tbody styleName="rims-tbody">
            {
              showedBrandIds.map((brandId, index) => (
                <tr
                  styleName={`${this.showSuccessStyle(brandId) ? 'tr-edit-success' : 'tr-normal-color'}`}
                  key={brandId}
                >
                  <td>{ fstItemNumber + index }</td>
                  <td>
                    <div>{ classesData[getClassId(brandId, brandsData)].name_zh_tw }</div>
                    <div>{ classesData[getClassId(brandId, brandsData)].name }</div>
                    <div>{ classesData[getClassId(brandId, brandsData)].name_zh_cn }</div>
                  </td>
                  <td>
                    <div>{ brandsData[brandId].name_zh_tw }</div>
                    <div>{ brandsData[brandId].name }</div>
                    <div>{ brandsData[brandId].name_zh_cn }</div>
                  </td>
                  <td>{ brandsData[brandId].vsp_id }</td>
                  <td styleName="comment-box">
                    <i className="fa fa-commenting" styleName={`${brandsData[brandId].memo.length > 0 ? 'comment-icon' : 'invisible-comment-icon'}`} aria-hidden="true">
                      <div styleName="tooltip-container">
                        <p styleName="wrap">{ brandsData[brandId].memo }</p>
                        <svg
                          styleName="triangle-wrapper"
                          width="20" height="10"
                        >
                          <polyline
                            styleName="triangle"
                            points="0,10 10,0 20,10"
                          />
                        </svg>
                      </div>
                    </i>
                  </td>
                  <td>{ brandsData[brandId].create_time }</td>
                  <td>
                    <div styleName={`${brandsData[brandId].recognizable === 1 ? 'checked-icon' : 'unchecked-icon'}`} />
                  </td>
                  <td>
                    <div styleName={`${brandsData[brandId].in_use === 1 ? 'checked-icon' : 'unchecked-icon'}`} />
                  </td>
                  <td>
                    <div tabIndex="0" styleName="edit-btn">
                      <i className="fa fa-cog" aria-hidden="true" styleName="gear-icon">
                        <div styleName={`${isBrandSameAsClass(classesData[getClassId(brandId, brandsData)], brandsData[brandId]) ? 'shorten-edit-container' : 'edit-container'}`}>
                          <p styleName="edit-item" onClick={() => this.handleEditBrandEnable(brandsData[brandId])}>
                            {t('editEnable')}
                          </p>
                          <p styleName={`${isBrandSameAsClass(classesData[getClassId(brandId, brandsData)], brandsData[brandId]) ? 'hide-edit-item' : 'edit-item'}`} onClick={() => this.handleEditBrandInfo(brandsData[brandId], classIds, brandIds, classesData, brandsData)}>
                            {t('edit')}
                          </p>
                        </div>
                      </i>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <Modal
          headerHide
          hideWhenBackground
          ref={(modal) => { this.editBrandEnableModal = modal; }}
        />
        <Modal
          headerHide
          hideWhenBackground
          ref={(modal) => { this.editBrandInfoModal = modal; }}
        />
      </div>
    );
  }
}

FaceModel.propTypes = {
  t: PropTypes.func,
  searchObj: PropTypes.shape({
    1: PropTypes.shape({
      searchText: PropTypes.string,
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      modelId: PropTypes.string,
    }),
  }),
  modelsData: PropTypes.shape({
    1: PropTypes.shape({
      id: PropTypes.number,
      classes: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
  classesData: PropTypes.shape({
    1: PropTypes.shape({
      id: PropTypes.number,
      brands: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
  brandsData: PropTypes.shape({
    1: PropTypes.shape({
      id: PropTypes.number,
      vsp_id: PropTypes.string,
    }),
  }),
  requestModelData: PropTypes.func,
  isUploadCsvSuccess: PropTypes.bool,
  showAddBrandModal: PropTypes.bool,
  cancelAddBrandModal: PropTypes.func,
  submitAddBrand: PropTypes.func,
  addBrandFailedList: PropTypes.arrayOf(PropTypes.shape({
    vsp_id: PropTypes.string,
  })),
  clearAddFailedBrand: PropTypes.func,
  submitEditBrand: PropTypes.func,
  isSomeBrandsSuccess: PropTypes.bool,
  successStyleBrand: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
      }),
    ),
  ]),
  clearEditBrandFailedList: PropTypes.func,
};

export default translate([NAME])(CSSModules(FaceModel, styles));
