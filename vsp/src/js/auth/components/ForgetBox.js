import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { routerUtil } from 'utils';
import { translate } from 'react-i18next';
import { Button } from 'vidya/Button';

import { NAME } from '../constants';
import styles from '../styles/forgetBox.scss';

const redirect = () => routerUtil.pushHistory(`/${NAME}/signin`);

class ForgetBox extends React.Component {

  render() {
    const { t } = this.props;

    return (
      <div styleName="container">
        <div styleName="row">
          <h2>{t('contactLabel')}</h2>
        </div>
        <div styleName="midRow">
          <div>
            <p>{t('contactPrompt')}</p>
          </div>
          <div>
            <a>admin@viscovery.com</a>
          </div>
        </div>
        <div styleName="row">
          <Button
            vdSize="normal"
            vdStyle="secondary"
            onClick={redirect}
          >{t('loginPrompt')}</Button>
        </div>
      </div>
    );
  }
}

ForgetBox.propTypes = {
  t: PropTypes.func,
};

export default translate([NAME])(CSSModules(ForgetBox, styles));
