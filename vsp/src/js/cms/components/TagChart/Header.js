import PropTypes from 'prop-types';
import React from 'react';

import { translate } from 'react-i18next';

import { NAME } from '../../constants';

const propTypes = {
  t: PropTypes.func.isRequired,
};

class Header extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div>
        <h3>{t('topTags')}</h3>
      </div>
    );
  }
}

Header.propTypes = propTypes;

export default translate([NAME])(Header);
