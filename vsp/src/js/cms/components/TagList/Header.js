import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';

import styles from './styles.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
};

class Header extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div styleName="header">
        <h3>{t('tags')}</h3>
      </div>
    );
  }
}

Header.propTypes = propTypes;

export default translate([NAME])(CSSModules(Header, styles));
