import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import HrsMonitor from '../../components/AdminApp/HrsMonitor';

import {
} from '../../actions';

import {
  getAdminTasks,
  getAdminUsers,
  getOnlineUserIds,
} from '../../selectors/hrsAdminSelector';

import {
  getBrands as getBrandsFromStructure,
} from '../../selectors/structureSelector';

const getLocale = state => state.lang.locale;

const mapStateToProps = createStructuredSelector({
  tasks: getAdminTasks,
  users: getAdminUsers,
  onlineUserIds: getOnlineUserIds,
  brandsFromStructure: getBrandsFromStructure,
  lang: getLocale,
});

const mapDispatchToProps = () => ({});

const HrsMonitorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HrsMonitor);

export default HrsMonitorContainer;
