import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Button from 'vidya/Button/Button';
import LTracker from 'utils/LTracker';

import DispatchErrorWindow from './DispatchErrorWindow';
import styles from './FinishJobWindow.scss';

const trackErr = (step, err) => {
  LTracker.send({
    category: 'hrs_dispatch',
    level: 'error',
    error: JSON.stringify(err),
    step,
  });
  // console.log('console Err track:', step, err);
};

class FinishJobWindow extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleStage = this.handleStage.bind(this);
    this.handleLoading = this.handleLoading.bind(this);
    this.handleSubmitFail = this.handleSubmitFail.bind(this);
    this.handleReleaseFail = this.handleReleaseFail.bind(this);
    this.handleDispatchFail = this.handleDispatchFail.bind(this);
    this.retryDispatch = this.retryDispatch.bind(this);

    this.state = {
      stage: 0,
      loading: false,
      submitFail: false,
      releaseFail: false,
      errMsg: null,
    };
  }

  handleStage(stage) {
    this.setState({
      stage,
    });
  }

  handleSubmitFail(submitFail) {
    this.setState({
      submitFail,
    });
  }

  handleReleaseFail(releaseFail) {
    this.setState({
      releaseFail,
    });
  }

  handleLoading(loading) {
    this.setState({
      loading,
    });
  }

  handleDispatchFail(errMsg) {
    this.setState({
      errMsg,
      stage: 2,
    });
  }

  retryDispatch() {
    this.setState({
      loading: false,
      errMsg: null,
      stage: 1,
    });
  }

  render() {
    const { submitTask, wrappedLogout, getDispatch, toHide } = this.props;
    const { loading } = this.state;
    const submitHeader = this.state.submitFail ? '提交失敗, 是否再次提交?' : '確定要提交嗎？';
    const releaseBtnMsg = this.state.releaseFail ? '釋出失敗 再試一次' : '要回家休息了';
    return (
      <div >
        {
          this.state.stage === 0
          ?
            <div styleName="container">
              <h2
                style={{
                  marginBottom: '32px',
                  textAlign: 'center',
                }}
              >
                {submitHeader}
              </h2>
              <Button
                vdStyle="primary"
                vdSize="normal"
                onClick={() => {
                  this.handleLoading(true);
                  submitTask()
                    .then(() => {
                      this.handleLoading(false);
                      this.handleSubmitFail(false);
                    },
                      (reason) => {
                        this.handleSubmitFail(true);
                        return Promise.reject({ ...reason });
                      })
                    .then(() => this.handleStage(1))
                    .catch((err) => { this.handleLoading(false); trackErr('submit error', err); });
                }}
                style={{
                  marginBottom: '15px',
                }}
                disable={loading}
              >
                確定
              </Button>
              <Button
                vdStyle="secondary"
                vdSize="normal"
                onClick={toHide}
                disable={loading}
              >
                再次檢查
              </Button>
            </div>
          : null
        }
        {
          this.state.stage === 1
          ?
            <div styleName="container">
              <h2
                style={{
                  marginBottom: '32px',
                  textAlign: 'center',
                }}
              >
                幹得好勇士！
              </h2>
              <h2
                style={{
                  marginBottom: '32px',
                  textAlign: 'center',
                }}
              >
                繼續下一段旅程吧！
              </h2>
              <Button
                vdStyle="primary"
                vdSize="normal"
                onClick={() => {
                  this.handleLoading(true);
                  getDispatch()
                    .then(() => { this.handleLoading(false); toHide(); },
                      (err) => {
                        const errMsg = err.response_msg || null;
                        trackErr('getTaskId', err);
                        this.handleDispatchFail(errMsg);
                        return Promise.reject({});
                      })
                    .then(() => this.handleStage(0))
                    .catch((err) => { this.handleLoading(false); trackErr('getDispatch', err); });
                }}
                style={{
                  marginBottom: '15px',
                }}
                disable={loading}
              >
                再來一組
              </Button>
              <Button
                vdStyle="secondary"
                vdSize="normal"
                onClick={() => {
                  this.handleLoading(true);
                  wrappedLogout()
                    .then(() => {
                      this.handleLoading(false);
                      this.handleReleaseFail(false);
                    },
                      (reason) => {
                        this.handleReleaseFail(true);
                        return Promise.reject({ ...reason });
                      })
                    .then(toHide)
                    .then(() => this.handleStage(0))
                    .catch((err) => { this.handleLoading(false); trackErr('release error', err); });
                }}
                disable={loading}
              >
                {releaseBtnMsg}
              </Button>
            </div>
          : null
        }
        {
          this.state.stage === 2
          ?
            <DispatchErrorWindow
              msg={this.state.errMsg}
              retryCallback={this.retryDispatch}
            />
          : null
        }
      </div>
    );
  }
}

FinishJobWindow.propTypes = {
  submitTask: PropTypes.func,
  wrappedLogout: PropTypes.func,
  getDispatch: PropTypes.func,
  toHide: PropTypes.func,
};

export default CSSModules(FinishJobWindow, styles);
