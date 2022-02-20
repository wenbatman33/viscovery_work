import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { NAME } from '../constants';

import { requestBriefGroups, requestRoleOptions, requestCountries, updateUser } from '../actions';
import { getContactOptions, getGroupsOptions, getRoleOptions } from '../selectors';

import UserForm from '../components/UserForm';

const mapStateToProps = createStructuredSelector({
  data: (state, props) =>
    state[NAME].users.find(user => user.uid === Number(props.match.params.user_id)),
  contactOptions: getContactOptions,
  groupOptions: getGroupsOptions,
  roles: getRoleOptions,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
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
  updateUser: (formResult) => {
    const action = updateUser(ownProps.match.params.user_id, formResult);
    dispatch(action);
  },
});

const UpdateUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserForm);

export default UpdateUserContainer;
