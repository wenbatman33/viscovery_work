import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { sum } from 'utils/mathUtil';

import TagLink from './TagLink';

import styles from './ModelArea.scss';

const linkStyle = (modelId, brandId, linkModelId, linkBrandId) => (
  (modelId.toString() === linkModelId.toString() && brandId.toString() === linkBrandId.toString()) ? 'current' : 'non-current'
);

const handleLessThanOne = num => ((num < 1 && num > 0) ? '<1' : Math.round(num));

const modelDict = {
  1: 'Face',
  6: 'Object',
  7: 'Scene',
};

const ModelArea = ({ modelId, brands, linkTo, currentBrandId, currentModelId }) => {
  const undoneCount = sum(brands)('undone');
  const totalCount = sum(brands)('total');
  const doneCount = totalCount - undoneCount;
  const percentOfRatio = (doneCount / totalCount) * 100;
  return (
    <div>
      <div
        styleName="model-title"
      >
        <p styleName="model-name">{`${modelDict[modelId]}`}</p>
        <p styleName="model-progress">{`${doneCount}/${totalCount} (${handleLessThanOne(percentOfRatio)}%)`}</p>
        <p
          styleName={percentOfRatio === 100 ? 'check-icon' : 'hidden'}
        >
          <i
            className="fa fa-check-circle"
            aria-hidden="true"
          />
        </p>
      </div>
      <div styleName="navArea">
        {
          brands.map(brand => (
            <div
              styleName={linkStyle(currentModelId, currentBrandId, modelId, brand.id)}
              key={brand.id}
            >
              <TagLink
                text={`${brand.name} ${(brand.total - brand.undone)}/${brand.total}`}
                onClick={linkTo(modelId)(brand.id)}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

ModelArea.propTypes = {
  modelId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  brands: PropTypes.arrayOf(PropTypes.object),
  linkTo: PropTypes.func,
  currentBrandId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  currentModelId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

ModelArea.defaultProps = {
  modelId: '',
  brands: '',
  linkTo: '',
  currentBrandId: '',
  currentModelId: '',
};

export default CSSModules(ModelArea, styles);
