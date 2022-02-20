import { connect } from 'react-redux';
import { LoadingBar } from 'vidya/LoadingBar';
import { LOADING_BAR_REDUCER_NAME } from '../constants';


const mapStateToProps = state => (
  {
    showLoading: state[LOADING_BAR_REDUCER_NAME].loadingBar,
    loadingMessage: state[LOADING_BAR_REDUCER_NAME].loadingMessage,
  }
);

export default connect(mapStateToProps)(LoadingBar);
