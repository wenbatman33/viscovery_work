/* *******
Created Date : 2016/9/1
File Name : SignIn.js
Copyright (c) Viscovery.co
Author : Amdis Liu
Description : A reusable component consists of basic user log in functions, such as id/pwd input,
forget password link, sign in button and so on
****** */

import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import { routerUtil, cookieUtil } from 'utils';
import { translate } from 'react-i18next';
import { Button } from 'vidya/Button';
import { TextInput } from 'vidya/Form';
import { Banner } from 'vidya/Feedback';
import { NAME } from '../constants';

import styles from '../styles/signin.scss';

const forgetPwd = () => routerUtil.pushHistory(`/${NAME}/signin/forgetPwd`);

class SignIn extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      account: '',
      password: '',
    };

    this.OnAccountChange = this.OnAccountChange.bind(this);
    this.OnPasswordChange = this.OnPasswordChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    cookieUtil.removeGroup();
    cookieUtil.removeRole();
  }

  OnAccountChange(account) {
    this.setState({ account });
  }

  OnPasswordChange(password) {
    this.setState({ password });
  }

  handleSignIn() {
    const state = this.state;
    if (this.props.onSignIn) {
      this.props.onSignIn(state.account, state.password);
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSignIn();
    }
  }

  render() {
    const { location, t } = this.props;
    let message;
    switch (R.path(['query', 'type'])(location)) {
      case 'expired':
        message = `${t('expirePrompt')}`;
        break;
      default:
        if (this.props.message) {
          message = `${t('incorrectPrompt')}`;
        }
        break;
    }
    return (
      <div styleName="signinContainer">
        <div styleName="titleRow">
          <h2>{t('loginPrompt')}</h2>
        </div>
        <div styleName="bannerRow">
          { message ? <Banner>{message}</Banner> : null }
        </div>
        <div styleName="row">
          <label htmlFor="signinAccount">{t('accountLabel')}</label>
          <TextInput
            id="signinAccount"
            value={this.state.account}
            placeholder={t('accountPrompt')}
            onChange={this.OnAccountChange}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <div styleName="pwdRow">
          <label htmlFor="signinPw">{t('passwordLabel')}</label>
          <TextInput
            id="signinPw"
            value={this.state.password}
            placeholder={t('passwordPrompt')}
            onChange={this.OnPasswordChange}
            onKeyPress={this.handleKeyPress}
            password
          />
          <div styleName="forgetLink">
            <Button
              vdSize="redirect"
              vdStyle="blueLink"
              onClick={forgetPwd}
            >{t('forgetPassword')}</Button>
          </div>
        </div>
        <div styleName="btnRow">
          <Button
            vdSize="big"
            vdStyle="primary"
            onClick={this.handleSignIn}
          >{t('submit')}</Button>
        </div>
      </div>
    );
  }
}

SignIn.propTypes = {
  onSignIn: PropTypes.func,
  showError: PropTypes.bool,
  message: PropTypes.node,
  location: PropTypes.object,
  t: PropTypes.func,
};


export default new translate([NAME])(CSSModules(SignIn, styles));
