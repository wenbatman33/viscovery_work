import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';

import { Banner } from 'vidya/Feedback';
import AlertDialogContainer from '../containers/AlertDialogContainer';
import { setMessage } from '../actions';

import styles from './App.scss';

class App extends React.PureComponent {
  componentWillUnmount() {
    this.props.dispatch(setMessage(null, true));
  }

  render() {
    const props = this.props;
    return (
      <div styleName="tag2ad-app">
        <AlertDialogContainer />
        <div styleName="content">
          {props.message
            ? (
              <div styleName="banner">
                <Banner vdStyle={props.messageSuccess}>{props.message}</Banner>
              </div>
            )
            : null
          }
          {
            props.children
          }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  left: PropTypes.node,
  right: PropTypes.node,
  message: PropTypes.string,
  messageSuccess: PropTypes.bool,
  imgHost: PropTypes.string,
  videoHost: PropTypes.string,
  dispatch: PropTypes.func,
};

export default CSSModules(App, styles);
