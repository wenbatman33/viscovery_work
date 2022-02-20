import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  showAlert,
  getAlertMessage,
} from '../selectors';

import {
  dismissAlert,
} from '../actions';

import AlertDialog from '../components/AlertDialog';

const mapStateToProps = createStructuredSelector(({
  show: showAlert,
  message: getAlertMessage,
}));

const mapDispatchToProps = dispatch => (
  {
    onConfirm: () => dispatch(dismissAlert()),
  }
);

const AlertDialogContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertDialog);

export default AlertDialogContainer;
