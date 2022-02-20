import React, { Component } from 'react';
import { Link } from 'react-router';

const { PinstreamUtilitiesWeb } = require('../../utilities');

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: PinstreamUtilitiesWeb.uid() ? 'Log Out' : 'Log In',
      logoutparam: `${PinstreamUtilitiesWeb.indexpage}?out=1`,
      username: PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[6]) || 'User'
    };
  }
  logout = () => {
    PinstreamUtilitiesWeb.removeTokenInfoTolocalStorage();
  }
  render() {
    return (
      <div className="userDes">
        Hi {this.state.username} !! <br />
        <Link to={this.state.logoutparam} onClick={this.logout} >
          ({this.state.status})
        </Link>
      </div>
    );
  }
}
