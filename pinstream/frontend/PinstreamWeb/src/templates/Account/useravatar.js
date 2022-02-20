import React, { Component } from 'react';
import UserPhoto from '../../static/img/userPhoto.png';

const { PinstreamUtilitiesWeb } = require('../../utilities');

export default class UserAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgid: PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[5])
    };
  }

  getusericon = () => {
    let element = <img className="polygon" alt="userAvatar" src={UserPhoto} />;
    if (this.state.imgid) {
      const imgsrc = `//graph.facebook.com/${this.state.imgid}/picture?type=small`;
      element = <img className="polygon" src={imgsrc} alt="userAvatar" />;
    }
    return element;
  }

  render() {
    return (
      <div className="userIcon">
        {this.getusericon()}
      </div>
    );
  }
}
