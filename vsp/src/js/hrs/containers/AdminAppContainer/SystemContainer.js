import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import System from '../../components/AdminApp/System';

import {
} from '../../actions';

import {
} from '../../selectors/hrsAdminSelector';

const mapStateToProps = createStructuredSelector({
});

const mapDispatchToProps = () => ({
});

const SystemContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(System);

export default SystemContainer;
