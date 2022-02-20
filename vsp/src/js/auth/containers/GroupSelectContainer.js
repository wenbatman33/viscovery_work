import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getChoices, getGroups, getRoles } from '../selectors';
import { requestBriefGroups, requestRoles, patchRole } from '../actions';

import GroupSelect from '../components/GroupSelect';
import { getLocale } from '../../app/selectors';

const mapStateToProps = createStructuredSelector({
  choices: getChoices,
  groups: getGroups,
  roles: getRoles,
  locale: getLocale,
});

const mapDispatchToProps = dispatch => ({
  getGroups: () => {
    const action = requestBriefGroups();
    dispatch(action);
  },
  getRoles: () => {
    const action = requestRoles();
    dispatch(action);
  },
  getChoices: () => {
  },
  patchRole: (groupId, roleId) => {
    const action = patchRole(groupId, roleId);
    dispatch(action);
  },
});

const GroupSelectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupSelect);

export default GroupSelectContainer;
