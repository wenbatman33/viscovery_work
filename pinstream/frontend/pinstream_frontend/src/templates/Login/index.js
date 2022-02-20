import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import Logo from '../../static/img/logo.svg';

const { PinstreamUtilitiesWeb } = require('../../utilities');
/*global FB*/
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viscoveryForm: false,
      email: '',
      password: '',
      appId: (process.env.NODE_ENV === 'production') ? '1128854430548522' : '719985468197644',
      env: process.env.NODE_ENV,
      videolistpage: '/VideoList',
      extensionpage: '/LoadingPage',
      fbbutton: null,
      clickedcount: 0
    };
    this.emailLogin = this.emailLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.enroll = this.enroll.bind(this);
    this.onRedirectToMamagement = this.onRedirectToMamagement.bind(this);
    this.onreadychange = this.onreadychange.bind(this);
  }
  onRedirectToMamagement(responseText) {
    if (responseText) {
      const data = responseText;//JSON.parse(responseText);
      if (data && data.isSuccess) {
        PinstreamUtilitiesWeb.setTokenInfoTolocalStorage(data);
        if (this.props.location.query.origin === 'chrome') {
          this.props.router.push(this.state.extensionpage);
        } else {
          this.props.router.push(this.state.videolistpage);
        }
      }
    }
  }
  onreadychange() {
    if (this.readyState === 4 && this.status === 200) {
      this.onRedirectToMamagement(this.responseText);
    }
    console.info('Server error');
  }
  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }
  emailLogin() {
    if (this.state.env === 'production') {
      const formData = new FormData();
      formData.append('email', this.state.email);
      formData.append('password', this.state.password);
      formData.append(PinstreamUtilitiesWeb.keys[4], PinstreamUtilitiesWeb.clientId);

      fetch('/api/v1/login/email', {
        method: 'POST',
        body: formData
      }).then(response => response.json()).then((json) => {
        this.onRedirectToMamagement(json);
      });
    } else {
      PinstreamUtilitiesWeb.setTokenInfoTolocalStorage(
        { uid: 'test', expires_in: Math.floor(Date.now() / 1000) + 3000 }
      );
      if (this.props.location.query.origin === 'chrome') {
        // window.location.href = this.state.extensionpage;
        this.props.router.push(this.state.extensionpage);
      } else {
        this.props.router.push(this.state.videolistpage);
      }
    }
  }
  changeLoginType = () => {
    this.setState({ viscoveryForm: !this.state.viscoveryForm });
  };
  enroll(fdata) {
    if (this.state.env === 'production') {
      fetch('/api/v1/enroll', {
        method: 'POST',
        body: fdata
      }).then(response => response.json()).then((json) => {
        this.onRedirectToMamagement(json);
      });
    } else {
      this.props.router.push(this.state.videolistpage);
    }
  }
  fbclicked = (event) => {
    const button = event.target;
    if (button) {
      this.setState({ fbbutton: button });
      button.disabled = true;
    }
  }
  picclicked = () => {
    this.setState({ clickedcount: this.state.clickedcount += 1 });
    if (this.state.clickedcount === 3) {
      this.setState({ viscoveryForm: true, clickedcount: 0 });
    }
  }
  responseFacebook(response) {
    // console.info(response);
    this.state.fbbutton.disabled = false;
    if (response.id && response.email && response.birthday) {
      PinstreamUtilitiesWeb.localStorageSetIem(PinstreamUtilitiesWeb.keys[5], response.id);
      PinstreamUtilitiesWeb.localStorageSetIem(PinstreamUtilitiesWeb.keys[6], response.name);
      const fdata = new FormData();
      fdata.append('id', response.id);
      fdata.append('email', response.email);
      fdata.append('birthday', response.birthday);
      fdata.append(PinstreamUtilitiesWeb.keys[4], PinstreamUtilitiesWeb.clientId);
      this.enroll(fdata);
    } else if (response.id) {
      //todo mobile first error page
      FB.api(`/${response.id}/permissions`, 'DELETE', {}, rs => console.info(rs));
      FB.logout((() => { console.info('fb logout'); }));
    } else {
      console.info('error or no access info');
    }
  }
  render() {
    return (
      <div className="LoginPage">
        <div className="container">
          <div className="row">
            <div className="LoginImageWrap col-xs-12 col-sm-12 col-md-7 col-lg-7">
              <div className="PinstreamLogo">
                <img alt="PinStream" src={Logo} />
              </div>
              <div className="PinstreamImg" onClick={this.picclicked} />
            </div>
            <div className="LoginFormWrap col-xs-12 col-sm-12 col-md-5 col-lg-5">
              <h1>EASILY PIN VIDEOS</h1>
              <p>Pin your favorite videos in one place</p>
              {(!this.state.viscoveryForm) ?
                <div>
                  <FacebookLogin
                    appId={this.state.appId}
                    fields="id,name,email,birthday"
                    scope="public_profile,email,user_birthday"
                    callback={this.responseFacebook}
                    onClick={this.fbclicked}
                    disableMobileRedirect={Boolean(true)}
                    textButton="Continue With Facebook"
                  />
                  {/*<p className="logInLink"
                    onClick={this.changeLoginType}>Login With Pinstream</p>*/}
                </div>
                :
                <div>
                  <input type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="email" />
                  <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="password" />
                  <button onClick={this.emailLogin}>Sign in</button>
                  <p className="logInLink" onClick={this.changeLoginType}>Continue With Facebook</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  router: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  location: React.PropTypes.object // eslint-disable-line react/forbid-prop-types
};
