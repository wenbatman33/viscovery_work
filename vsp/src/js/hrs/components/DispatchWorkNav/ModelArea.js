import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import TagLink from './TagLink';

import styles from './ModelArea.scss';

const linkStyle = (modelId, brandId, linkModelId, linkBrandId) => (
  (modelId.toString() === linkModelId.toString() && brandId.toString() === linkBrandId.toString()) ? 'current' : 'non-current'
);

const handleLessThanOne = num => ((num < 1 && num > 0) ? '<1' : Math.round(num));
const handlePercent = numerator => denominator =>
  handleLessThanOne(R.divide(numerator, denominator) * 100);

const ModelArea = ({ modelId, brands, currentBrandId, currentModelId }) => (
  <div>
    <div styleName="navArea">
      {
        brands.filter(brand => brand.id === currentBrandId).map(brand => (
          <div
            styleName={linkStyle(currentModelId, currentBrandId, modelId, brand.id)}
            key={brand.id}
          >
            <TagLink
              text={`${brand.name} ${(brand.total - brand.undone)}/${brand.total} (${handlePercent(brand.total - brand.undone)(brand.total)}%)`}
            />
          </div>
        ))
      }
    </div>
  </div>
);

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
  currentBrandId: '',
  currentModelId: '',
};

export default CSSModules(ModelArea, styles);
