import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';
import i18n from '../../i18next';

import styles from './I18nSelector.scss';

class I18nSelector extends React.PureComponent {
  render() {
    const {
      t,
      changeLocale,
    } = this.props;
    return (
      <ul
        role="group"
        styleName="container"
      >
        <li
          role="menuitem"
          styleName="button"
          onClick={() => {
            changeLocale('enus');
            i18n.changeLanguage('en-US');
          }}
        >
          <p>
            {t('english')}
          </p>
        </li>
        <li
          role="menuitem"
          styleName="button"
          onClick={() => {
            changeLocale('zhcn');
            i18n.changeLanguage('zh-CN');
          }}
        >
          <p>
            {t('simplifiedChinese')}
          </p>
        </li>
        <li
          role="menuitem"
          styleName="button"
          onClick={() => {
            changeLocale('zhtw');
            i18n.changeLanguage('zh-TW');
          }}
        >
          <p>
            {t('traditionalChinese')}
          </p>
        </li>
      </ul>
    );
  }
}

I18nSelector.propTypes = {
  changeLocale: PropTypes.func,
  t: PropTypes.func,
};

const output = CSSModules(I18nSelector, styles);
export default translate([NAME])(output);
