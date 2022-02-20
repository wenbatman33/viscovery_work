import { connect } from 'react-redux';
import R from 'ramda';
import WorkNav from '../components/WorkNav';

import {
  combineModelIdBrandId,
} from '../utils';

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
  requestBrandBrief,
  requestTagsMapping,
} from '../actions';

const getLocale = state => state.lang.locale;

const langMapping = {
  enus: 'name',
  zhcn: 'name_zh_cn',
  zhtw: 'name_zh_tw',
};

export const translate = (dict, locale) => (brand) => {
  const nameLocale = langMapping[locale];
  const key = combineModelIdBrandId(R.path(['model', 'id'])(brand))(brand.id);
  if (dict[key]) {
    if (dict[key][nameLocale]) {
      return {
        ...brand,
        name: dict[key][nameLocale],
      };
    }
  }

  return {
    ...brand,
    name: brand.id,
  };
};

const translateBrand = (brandsSelector, brandDictSelector, localeSelector) => state => (
  brandsSelector(state).map(translate(brandDictSelector(state), localeSelector(state)))
);

const mapStateToProps = (state, ownProps) => (
  {
    brands: translateBrand(getBrands, getBrandsFromStructure, getLocale)(state),
    videoName: getVideoName(state),
    show: getWorkNav(state),
    brandId: ownProps.brandId || getCurrentBrandId(state),
    videoId: ownProps.videoId || getCurrentVideoId(state),
    modelId: ownProps.modelId || getCurrentModelId(state),
  }
);

const mapDispatchToProps = dispatch => ({
  requestBrandBrief: (videoId) => {
    if (videoId === '') return;
    dispatch(requestBrandBrief(videoId));
  },
  requestTagsMapping: (lang) => {
    dispatch(requestTagsMapping(lang));
  },
});

const WorkNavContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkNav);

export default WorkNavContainer;
