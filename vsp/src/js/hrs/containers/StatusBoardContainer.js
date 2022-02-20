import { connect } from 'react-redux';

import StatusBoard from '../components/StatusBoard';

import {
  getVisibilityFilter,
} from '../selectors/visibilityFilterSelector';

import {
  getRemainCount,
  getVideoName,
} from '../selectors/tagsSelector';

import {
  getWorkNav,
} from '../selectors/liliCocoSelector';

import {
  getBrands as getBrandsFromStructure,
} from '../selectors/structureSelector';

import {
  translate,
} from './WorkNavContainer';

import {
  changeVisibilityFilter,
  toggleWorkNav,
} from '../actions';

const getLocale = state => state.lang.locale;

const translateBrand = (brandId, modelId) => (brandDictSelector, localeSelector) => state => (
  translate(brandDictSelector(state), localeSelector(state))({
    id: brandId,
    model: {
      id: modelId,
    },
  }).name
);

const mapStateToProps = (state, ownProps) => ({
  currentFilter: getVisibilityFilter(state),
  remainCount: getRemainCount(state),
  brandName: translateBrand(
    ownProps.brandId, ownProps.modelId
  )(getBrandsFromStructure,
  getLocale
  )(state),
  videoName: getVideoName(state),
  workNavShow: getWorkNav(state),
});

const mapDispatchToProps = dispatch => ({
  changeVisibilityFilter: (filter) => {
    dispatch(changeVisibilityFilter(filter));
  },
  toggleWorkNav: () => {
    dispatch(toggleWorkNav());
  },
});


const StatusBoardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatusBoard);

export default StatusBoardContainer;
