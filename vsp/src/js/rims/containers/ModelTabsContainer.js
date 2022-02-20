import { connect } from 'react-redux';

import ModelTabs from '../components/ModelTabs';

import { getIsImporting, getDuplicateBrands, checkIsCsvUploadIllegal } from '../selectors/modelTabsSelector';

import { submitSearchTextCreator, uploadCsvCreator, clearDupBrandsCreator, openAddBrandCreator, clearCsvUploadIllegalCreator } from '../actions';

const mapStateToProps = state => (
  {
    isImporting: getIsImporting(state),
    duplicateBrands: getDuplicateBrands(state),
    isCsvUploadIllegal: checkIsCsvUploadIllegal(state),
  }
);

const mapDispatchToProps = dispatch => ({
  submitSearchText: searchObj => dispatch(submitSearchTextCreator(searchObj)),
  uploadCsv: file => dispatch(uploadCsvCreator(file)),
  clearDupBrands: () => dispatch(clearDupBrandsCreator()),
  openAddBrand: () => dispatch(openAddBrandCreator()),
  clearCsvUploadIllegal: () => dispatch(clearCsvUploadIllegalCreator()),
});

const ModelTabsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelTabs);

export default ModelTabsContainer;
