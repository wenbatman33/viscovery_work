import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { requestCountries, createGroup, requestAdSetting } from '../actions';
import {
  getCountriesOptions,
  getAdModelOptions,
  getAdPlatformOptions,
  getAdVideoKeyOptions,
  getAdCustomCategoryOptions,
  getAdCustomTypeOptions,
} from '../selectors';

import GroupForm from '../components/GroupForm';

const mapStateToProps = createStructuredSelector({
  countriesOptions: getCountriesOptions,
  modelOptions: getAdModelOptions,
  platformOptions: getAdPlatformOptions,
  videoKeysOptions: getAdVideoKeyOptions,
  customCategoryOptions: getAdCustomCategoryOptions,
  customTypeOptions: getAdCustomTypeOptions,
});

const mapDispatchToProps = dispatch => ({
  requestCountries: () => {
    const action = requestCountries();
    dispatch(action);
  },
  createGroup: (formResult) => {
    const action = createGroup(formResult);
    dispatch(action);
  },
  requestAdSetting: () => dispatch(requestAdSetting()),
});


const CreateGroupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupForm);

export default CreateGroupContainer;
