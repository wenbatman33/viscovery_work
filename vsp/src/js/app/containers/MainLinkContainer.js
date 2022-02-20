import { connect } from 'react-redux';
import { getAllowedModules } from '../selectors';

import MainLink from '../components/Navbar/MainLink';

const mapStateToProps = state => ({
  permissions: getAllowedModules(state),
});

const MainLinkContainer = connect(
  mapStateToProps,
)(MainLink);

export default MainLinkContainer;
