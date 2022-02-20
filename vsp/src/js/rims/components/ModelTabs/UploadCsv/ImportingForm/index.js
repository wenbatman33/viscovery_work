import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../../../constants';
import styles from './ImportingForm.scss';

class ImportingForm extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div styleName="import-container">
        <h2 style={{ marginBottom: '32px' }}>
          {t('csvUploading')}
        </h2>
      </div>
    );
  }
}

ImportingForm.propTypes = {
  t: PropTypes.func,
};

export default translate([NAME])(CSSModules(ImportingForm, styles));
