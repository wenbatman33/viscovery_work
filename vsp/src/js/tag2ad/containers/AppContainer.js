import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import App from '../components/App';
import {
  getMessage,
  getMessageSuccess,
} from '../selectors';

const mapStateToProps = createStructuredSelector({
  message: getMessage,
  messageSuccess: getMessageSuccess,
});

export default connect(mapStateToProps)(App);
