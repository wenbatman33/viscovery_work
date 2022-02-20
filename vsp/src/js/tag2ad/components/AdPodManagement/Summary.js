import React from 'react';
import PropTypes from 'prop-types';
import { Interpolate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import styles from './AdPod.scss';
import { localize } from '../../utils';


const Summary = props => (
  <div styleName="summary">
    <Interpolate
      i18nKey="searchResultSummary"
      videoCount={props.videoCount}
      adCount={props.adCount}
    />
  </div>
);

Summary.propTypes = {
  t: PropTypes.func,
  adCount: PropTypes.number.isRequired,
  videoCount: PropTypes.number.isRequired,
};


export default localize(CSSModules(Summary, styles));
