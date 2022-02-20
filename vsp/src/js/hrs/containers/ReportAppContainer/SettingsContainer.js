import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Settings from '../../components/ReportApp/Settings';

import {} from '../../actions';

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = () => ({});

const SettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);

export default SettingsContainer;
