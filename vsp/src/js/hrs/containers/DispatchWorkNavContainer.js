import { connect } from 'react-redux';
import R from 'ramda';

import DispatchWorkNav from '../components/DispatchWorkNav';

import {
  getBrands,
  getVideoName,
} from '../selectors/tagsSelector';

import {
  getBrands as getBrandsFromStructure,
} from '../selectors/structureSelector';

import {
  getWorkNav,
  getCurrentModelId,
  getCurrentBrandId,
  getCurrentVideoId,
} from '../selectors/liliCocoSelector';

import {
  getProcessId,
} from '../selectors/hrsJobSelector';

import {
  requestBrandBrief,
  requestTagsMapping,
  wrappedLogout,
} from '../actions';

import {
  translate,
} from './WorkNavContainer';

const getLocale = state => state.lang.locale;

const translateBrand = (brandsSelector, brandDictSelector, localeSelector) => state => (
  brandsSelector(state).map(translate(brandDictSelector(state), localeSelector(state)))
);

const getUserId = state => R.path(['auth', 'user', 'uid'])(state);


const mapStateToProps = state => (
  {
    brands: translateBrand(getBrands, getBrandsFromStructure, getLocale)(state),
    videoName: getVideoName(state),
    show: getWorkNav(state),
    userId: getUserId(state),
    brandId: getCurrentBrandId(state),
    videoId: getCurrentVideoId(state),
    modelId: getCurrentModelId(state),
    processId: getProcessId(state),
  }
);

const mapDispatchToProps = dispatch => ({
  requestBrandBrief: (videoId, modelId, brandId) => {
    if (videoId) {
      dispatch(requestBrandBrief(videoId, modelId, brandId));
    }
  },
  requestTagsMapping: lang => dispatch(requestTagsMapping(lang)),
  wrappedLogout: (userId, processId) => dispatch(wrappedLogout(userId, processId)),
});

const DispatchWorkNavContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DispatchWorkNav);

export default DispatchWorkNavContainer;
