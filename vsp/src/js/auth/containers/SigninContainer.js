import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createStructuredSelector } from 'reselect';

import SignIn from '../components/SignIn';

import { isLoginFail, getErrorMessage } from '../selectors';
import { logIn } from '../actions';

const mapStateToProps = createStructuredSelector({
  showError: isLoginFail,
  message: getErrorMessage,
});

const mapDispatchToProps = dispatch => ({
  onSignIn: (userName, password) => {
    const action = logIn(userName, password);
    dispatch(action);
  },
});

const SigninContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);

export default withRouter(SigninContainer);
