import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Interpolate, translate } from 'react-i18next';

import { NAME } from '../../constants';

import styles from './styles.scss';

const CountComponent = CSSModules(({ count }) => (
  <span styleName="count">{count}</span>
), styles);

const MultiVideoForm = ({ videoNum }) => {
  const count = <CountComponent count={videoNum} />;
  return (
    <div styleName="description">
      <h3 styleName="title">
        <Interpolate i18nKey="deleteVideosConfirmation" count={count} />
      </h3>
    </div>
  );
};

MultiVideoForm.propTypes = {
  videoNum: PropTypes.number.isRequired,
};


export default translate([NAME])(CSSModules(MultiVideoForm, styles));
