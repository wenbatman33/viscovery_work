import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FaceModel from '../components/FaceModel';

import { getModelsData, getClassesData, getBrandsData, getIsUploadCsvSuccess, showAddBrandModal, getAddBrandFailedList, getIsSomeBrandsSuccess, getSuccessStyleBrand, getEditBrandFailedList } from '../selectors/faceModelSelector';

import { getSearchObj } from '../selectors/modelTabsSelector';

import { changePageCreator, requestModelDataCreator, cancelAddBrandModalCreator, submitAddBrandCreator, clearAddFailedBrandCreator, submitEditBrandCreator, clearEditBrandFailedListCreator } from '../actions';

const mapStateToProps = state => (
  {
    modelsData: getModelsData(state),
    classesData: getClassesData(state),
    brandsData: getBrandsData(state),
    searchObj: getSearchObj(state),
    isUploadCsvSuccess: getIsUploadCsvSuccess(state),
    showAddBrandModal: showAddBrandModal(state),
    addBrandFailedList: getAddBrandFailedList(state),
    isSomeBrandsSuccess: getIsSomeBrandsSuccess(state),
    successStyleBrand: getSuccessStyleBrand(state),
    editBrandFailedList: getEditBrandFailedList(state),
  }
);

const mapDispatchToProps = dispatch => ({
  handleChangePage: targetPage => dispatch(changePageCreator(targetPage)),
  requestModelData: (...params) => dispatch(requestModelDataCreator(...params)),
  cancelAddBrandModal: () => dispatch(cancelAddBrandModalCreator()),
  submitAddBrand: (brandSubmitData, callBack) =>
    dispatch(submitAddBrandCreator(brandSubmitData, callBack)),
  clearAddFailedBrand: () => dispatch(clearAddFailedBrandCreator()),
  submitEditBrand: (editedBrand, callBack) =>
    dispatch(submitEditBrandCreator(editedBrand, callBack)),
  clearEditBrandFailedList: () => dispatch(clearEditBrandFailedListCreator()),
});

const FaceModelContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FaceModel));

export default FaceModelContainer;
