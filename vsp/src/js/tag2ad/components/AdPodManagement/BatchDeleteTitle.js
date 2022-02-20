import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import { Interpolate } from 'react-i18next';
import styles from './BatchDeleteTitle.scss';

const AdCountComponent = CSSModules(({ adNumber }) => (
  <span styleName="number">{adNumber}</span>
), styles);

const BatchDeleteTitle = (props) => {
  const adCount = <AdCountComponent adNumber={props.adNumber} />;

  return (
    <Interpolate i18nKey="batch_delete_ad_title" total={adCount} />
  );
};

BatchDeleteTitle.propTypes = {
  t: PropTypes.func,
  adNumber: PropTypes.number,
};


export default BatchDeleteTitle;
