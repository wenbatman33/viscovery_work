import React, { Component } from 'react';
import { Link } from 'react-router';
import VideoItem from './components/VideoItem';
import Account from '../Account';
import UserAvatar from '../Account/useravatar';
import Logo from '../../static/img/logo.svg';

const { PinstreamUtilitiesWeb } = require('../../utilities');

export default class VideoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      this.getvideos(1);
    } else {
      this.getJson();
    }
  }
  ongetvideos() {
    const info = PinstreamUtilitiesWeb.getTokenInfofromlocalStorage();
    fetch(`/api/v1/video/${info[PinstreamUtilitiesWeb.keys[0]]}`, {
      method: 'GET',
      headers: {
        Authorization: `Token  ${info[PinstreamUtilitiesWeb.keys[1]]}`
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        return 400;
      }
      return null;
    }).then((json) => {
      if (json && json.videos) {
        this.setState({ data: json.videos });
      } else if (json === 400 || (json && !json.isSuccess)) {
        PinstreamUtilitiesWeb.removeTokenInfoTolocalStorage();
        // window.location.href = '/';
        console.info('no data');
      }
    }).catch((ex) => {
      console.log('parsing failed', ex);
    });
  }

  getvideos() {
    if (PinstreamUtilitiesWeb.isExpires()) {
      const info = PinstreamUtilitiesWeb.getTokenInfofromlocalStorage();
      const form = new FormData();
      form.append(PinstreamUtilitiesWeb.keys[0], info[PinstreamUtilitiesWeb.keys[0]]);
      form.append(PinstreamUtilitiesWeb.keys[2], info[PinstreamUtilitiesWeb.keys[2]]);
      form.append(PinstreamUtilitiesWeb.keys[3], info[PinstreamUtilitiesWeb.keys[3]]);
      form.append(PinstreamUtilitiesWeb.keys[4], PinstreamUtilitiesWeb.clientId);

      fetch('/api/v1/token', {
        method: 'POST',
        headers: {
          Authorization: `Token ${info[PinstreamUtilitiesWeb.keys[1]]}`
        },
        body: form
      }).then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          return 400;
        }
        return null;
      }).then(this.execgetvideo.bind(this)).catch((ex) => {
        console.log('parsing failed', ex);
      });
      return;
    }
    this.ongetvideos();
  }
  getJson = () => {
    fetch('./src/static/data/videoList.json')
      .then(res => res.json()).then((json) => {
        this.setState({
          data: json.videos
        });
      }).catch((err) => {
        console.log('parsing failed', err);
      });
  };
  execgetvideo = function execgetvideo(json) {
    if (json && json.isSuccess) {
      PinstreamUtilitiesWeb.setTokenInfoTolocalStorage(json);
      this.ongetvideos();
    } else if (json === 400 || (json && !json.isSuccess)) {
      PinstreamUtilitiesWeb.removeTokenInfoTolocalStorage();
      // window.location.href = '/';
      // console.info(json);
    }
  }
  render() {
    return (
      <div className="VideoList">
        <div className="container-fluid wrapper">
          <div className="header">
            <Link to={'/VideoList'}>
              <img alt="PinStream" src={Logo} />
            </Link>
            <div className="userAvatar">
              <UserAvatar/>
              <Account />
            </div>
          </div>
          <div className="VideoListContent">
            <div className="row">
              {
                this.state.data.map((video, index) => (
                  <VideoItem
                    key={index}
                    id={video.id}
                    title={video.title}
                    imgurl={video.imgurl}
                    website={video.website}
                    website_vid={video.website_vid}
                  />
                ))
              }
            </div>
          </div>
          <div className="footer">
            2017 © Viscovery All rights reserved
          </div>
        </div>
      </div>
    );
  }
}
