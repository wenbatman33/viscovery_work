import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import BrandsEditor from '../components/BrandsEditor';

import {
  getModels,
  getEditorClasses,
  getEditorBrands,
} from '../selectors/structureSelector';

import {} from '../actions';

const getLocale = state => state.lang.locale;

const mapStateToProps = createStructuredSelector(
  {
    models: getModels,
    classes: getEditorClasses,
    brands: getEditorBrands,
    lang: getLocale,
  }
);

const BrandsEditorContainer = connect(
  mapStateToProps,
  null,
  null,
  { withRef: true },
)(BrandsEditor);

export default BrandsEditorContainer;
