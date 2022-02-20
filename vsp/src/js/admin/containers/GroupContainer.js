import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { requestGroups, requestCountries } from '../actions';
import { getGroups, getCountries } from '../selectors';


import GroupTable from '../components/GroupTable';

const mapStateToProps = createStructuredSelector({
  groups: getGroups,
  countryOptions: getCountries,
});

const mapDispatchToProps = dispatch => ({
  requestCountries: () => {
    dispatch(requestCountries());
  },
  requestGroups: () => {
    dispatch(requestGroups());
  },
});

const GroupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupTable);

export default GroupContainer;
