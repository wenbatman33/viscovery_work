import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Button from 'vidya/Button/Button';
import LTracker from 'utils/LTracker';

import ModelArea from './ModelArea';

import styles from './DispatchWorkNav.scss';

const trackErr = (step, err) => {
  LTracker.send({
    category: 'hrs_dispatch',
    level: 'error',
    error: JSON.stringify(err),
    step,
  });
  console.log('console Err track:', step, err);
};

const groupByModel = brands => (
  brands.reduce((pV, cV) => {
    const result = pV;
    const key = cV.model.id;
    if (result[key]) {
      result[key] = [...result[key], cV];
    } else {
      result[key] = [cV];
    }
    return result;
  }, {})
);

class DispatchWorkNav extends React.Component {
  constructor(props) {
    super(props);

    this.handleReleaseFail = this.handleReleaseFail.bind(this);
    this.handleLoading = this.handleLoading.bind(this);

    this.state = {
      releaseFail: false,
      loading: false,
    };
  }
  componentDidMount() {
    const {
      videoId,
      modelId,
      brandId,
    } = this.props;
    this.props.requestBrandBrief(videoId, modelId, brandId);
    this.props.requestTagsMapping();
  }

  componentDidUpdate(prevProps) {
    const {
      videoId,
      modelId,
      brandId,
    } = this.props;
    if (`${prevProps.videoId}-${prevProps.modelId}-${prevProps.brandId}`
      !== `${this.props.videoId}-${this.props.modelId}-${this.props.brandId}`) {
      this.props.requestBrandBrief(videoId, modelId, brandId);
    }
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

  render() {
    const { loading } = this.state;
    const models = groupByModel(this.props.brands);
    const leaveBtnMsg = this.state.releaseFail ? '釋出失敗 再試一次' : '下班回家';
    return (
      <div styleName={this.props.show ? 'show' : 'hide'}>
        <h3
          style={{
            color: 'white',
            paddingLeft: '16px',
            paddingRight: '16px',
            marginBottom: '8px',
          }}
        >
          {`${this.props.videoName}`}
        </h3>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.5)',
            paddingLeft: '16px',
            marginBottom: '32px',
          }}
        />
        {
          Object.keys(models).map((modelId, index) => (
            <ModelArea
              key={index}
              modelId={modelId}
              brands={models[modelId]}
              currentBrandId={this.props.brandId}
              currentModelId={this.props.modelId}
            />
          ))
        }
        <div
          styleName="button-container"
        >
          <Button
            vdStyle="secondary"
            vdSize="normal"
            style={{
              bottom: '64px',
              position: 'absolute',
              width: '80%',
              color: loading ? 'grey' : 'inherit',
            }}
            onClick={() => {
              this.handleLoading(true);
              this.props.wrappedLogout(this.props.userId, this.props.processId)
              .then(() => {
                this.handleReleaseFail(false);
                this.handleLoading(false);
              },
                (reason) => {
                  this.handleReleaseFail(true);
                  this.handleLoading(false);
                  Promise.reject({ ...reason });
                }
              )
              .catch((err) => {
                trackErr('release error', err);
                this.handleLoading(false);
              });
            }}
            disable={loading}
          >
            {leaveBtnMsg}
          </Button>
        </div>
      </div>
    );
  }
}

DispatchWorkNav.propTypes = {
  brands: PropTypes.arrayOf(PropTypes.object),
  videoName: PropTypes.string,
  videoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  brandId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  modelId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  processId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  show: PropTypes.bool,
  requestBrandBrief: PropTypes.func,
  requestTagsMapping: PropTypes.func,
  wrappedLogout: PropTypes.func,
};

export default CSSModules(DispatchWorkNav, styles);
