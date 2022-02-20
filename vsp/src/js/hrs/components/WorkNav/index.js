import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';
import { sum } from 'utils/mathUtil';


import ModelArea from './ModelArea';

import styles from './WorkNav.scss';

const linkTo = videoId => modelId => brandId => (
  () => {
    routerUtil.pushHistory(`/hrs/video/${videoId}/model/${modelId}/brand/${brandId}`);
  }
);

const handleLessThanOne = num => ((num < 1 && num > 0) ? '<1' : Math.round(num));

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

class WorkNav extends React.Component {
  componentDidMount() {
    this.props.requestBrandBrief(this.props.videoId);
    this.props.requestTagsMapping();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.videoId !== this.props.videoId) {
      this.props.requestBrandBrief(this.props.videoId);
    }
  }

  render() {
    const sumOfModel = sum(this.props.brands);
    const models = groupByModel(this.props.brands);
    const undoneCount = sumOfModel('undone');
    const totalCount = sumOfModel('total');
    const doneCount = totalCount - undoneCount;
    const percentOfRatio = (doneCount / totalCount) * 100;
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
        >
          {`${doneCount}/${totalCount} (${handleLessThanOne(percentOfRatio)}%)`}
        </p>
        {
          Object.keys(models).map((modelId, index) => (
            <ModelArea
              key={index}
              modelId={modelId}
              brands={models[modelId]}
              linkTo={linkTo(this.props.videoId)}
              currentBrandId={this.props.brandId}
              currentModelId={this.props.modelId}
            />
          ))
        }
      </div>
    );
  }
}

WorkNav.propTypes = {
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
  show: PropTypes.bool,
  requestBrandBrief: PropTypes.func,
  requestTagsMapping: PropTypes.func,
};

export default CSSModules(WorkNav, styles);
