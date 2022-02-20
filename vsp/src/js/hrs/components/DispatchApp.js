import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Modal from 'vidya/Dialogs/Modal';

import DispatchWorkNavContainer from '../containers/DispatchWorkNavContainer';
import WorkSpaceContainer from '../containers/WorkSpaceContainer';

import StartJobWindow from './DispatchFlow/StartJobWindow';
import DispatchErrorWindow from './DispatchFlow/DispatchErrorWindow';

import styles from './DispatchApp.scss';

class DispatchApp extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getDispatchFlow = this.getDispatchFlow.bind(this);
    this.startJobWinodwShow = this.startJobWinodwShow.bind(this);
    this.dispatchErrorShow = this.dispatchErrorShow.bind(this);
  }

  componentDidMount() {
    if (this.props.userId) {
      this.startJobWinodwShow();
    }
    this.props.toggleWorkNavToHide();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId &&
      (prevProps.userId !== this.props.userId)
    ) {
      this.startJobWinodwShow();
    }
  }

  getDispatchFlow() {
    const {
      userId,
      getDispatch,
    } = this.props;

    return getDispatch(userId);
  }

  startJobWinodwShow() {
    this.modal.toShow();
    this.modal.switchContent(
      <StartJobWindow
        onClick={() =>
          this.getDispatchFlow()
            .then(this.modal.toHide,
              (err) => {
                setTimeout(() => {
                  this.dispatchErrorShow(err);
                });
              })
        }
      />
    );
  }

  dispatchErrorShow(err) {
    const msg = err.response_msg || '';
    this.modal.switchContent(
      <DispatchErrorWindow
        msg={msg}
        retryCallback={this.startJobWinodwShow}
      />
    );
  }

  render() {
    return (
      <div styleName="container">
        <DispatchWorkNavContainer />
        <WorkSpaceContainer />
        <Modal
          ref={(modal) => { this.modal = modal; }}
          hideWhenBackground
          headerHide
        />
      </div>
    );
  }
}

DispatchApp.propTypes = {
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  taskId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  getDispatch: PropTypes.func,
  toggleWorkNavToHide: PropTypes.func,
};

export default CSSModules(DispatchApp, styles);
