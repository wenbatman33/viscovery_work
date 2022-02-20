import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { requestBriefGroups, requestRoleOptions, requestCountries, createUser } from '../actions';
import { getContactOptions, getGroupsOptions, getGroups, getRoleOptions } from '../selectors';

import UserForm from '../components/UserForm';

const mapStateToProps = createStructuredSelector({
  contactOptions: getContactOptions,
  groups: getGroups,
  groupOptions: getGroupsOptions,
  roles: getRoleOptions,
});

const mapDispatchToProps = dispatch => ({
  getBriefGroups: () => {
    const action = requestBriefGroups();
    dispatch(action);
  },
  getRoles: () => {
    const action = requestRoleOptions();
    dispatch(action);
  },
  requestCountries: () => {
    const action = requestCountries();
    dispatch(action);
  },
  createUser: (formResult) => {
    const action = createUser(formResult);
    dispatch(action);
  },
});

const CreateUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserForm);

export default CreateUserContainer;
