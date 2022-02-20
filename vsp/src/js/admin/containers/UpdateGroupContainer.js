import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { NAME } from '../constants';
import { requestCountries, updateGroup, requestAdSetting } from '../actions';
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
  data: (state, props) =>
    state[NAME].groups.find(group => group.id === Number(props.match.params.group_id)),
  countriesOptions: getCountriesOptions,
  modelOptions: getAdModelOptions,
  platformOptions: getAdPlatformOptions,
  videoKeysOptions: getAdVideoKeyOptions,
  customCategoryOptions: getAdCustomCategoryOptions,
  customTypeOptions: getAdCustomTypeOptions,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestCountries: () => {
    const action = requestCountries();
    dispatch(action);
  },
  updateGroup: (formResult) => {
    const action = updateGroup(ownProps.match.params.group_id, formResult);
    dispatch(action);
  },
  requestAdSetting: () => dispatch(requestAdSetting()),
});


const UpdateGroupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupForm);

export default UpdateGroupContainer;
