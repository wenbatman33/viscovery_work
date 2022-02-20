import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';
import { NAME } from '../../constants';

import styles from './styles.scss';

class SeriesPanel extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onClick: PropTypes.func,
  };

  handleClick = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  render() {
    const { handleClick } = this;
    const { t } = this.props;
    return (
      <div styleName="panel">
        <div>
          <h3>{t('noVideo')}<br />{t('createFolderAndUpload')}</h3>
        </div>
        <Button vdSize="normal" vdStyle="primary" onClick={handleClick}>{t('createFolder')}</Button>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(SeriesPanel, styles));

