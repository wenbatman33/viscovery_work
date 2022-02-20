import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Login from '../components/Login';

const mapStateToProps = createStructuredSelector({

});

const mapDispatchToProps = () => ({

});

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default LoginContainer;
