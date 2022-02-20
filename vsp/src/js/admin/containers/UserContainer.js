import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { requestUsers } from '../actions';
import { getUsers } from '../selectors';


import UserTable from '../components/UserTable';

const mapStateToProps = createStructuredSelector({
  users: getUsers,
});

const mapDispatchToProps = dispatch => ({
  requestUsers: () => {
    const action = requestUsers();
    dispatch(action);
  },
});

const UserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTable);

export default UserContainer;
