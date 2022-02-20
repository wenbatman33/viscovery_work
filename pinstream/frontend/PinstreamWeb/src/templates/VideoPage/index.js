import React, { Component } from 'react';
import { Link } from 'react-router';
import VideoItem from './components/VideoItem';
import VideoContainer from './components/VideoContainer';
import Account from '../Account';
import UserAvatar from '../Account/useravatar';
import Logo from '../../static/img/logo.svg';
import FacebookIcon from '../../static/img/icon_facebook@2x.png';
import YoutubeIcon from '../../static/img/icon_youtube@2x.png';
import DailymotionIcon from '../../static/img/icon_dailymotion@2x.png';
import Vimeo from '../../static/img/icon_vimeo@2x.png';
import DeleteBtn from '../../static/img/icon_delete@2x.png';

/*global FB*/
const { PinstreamUtilitiesWeb } = require('../../utilities');

export default class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: '',
      vid: '',
      website: '',
      vd: this.props.params.vd,
      title: '',
      delhide: false
    };
    this.onremovevideo = this.onremovevideo.bind(this);
  }
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      this.getvideos();
    } else {
      this.getJson();
    }
    this.onUpdateVideo(this.props.params.vd);
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.vd !== nextProps.params.vd) {
      this.onUpdateVideo(nextProps.params.vd);
      window.scroll(0, 0);
    }
  }
  onUpdateVideo(nextvd) {
    if (nextvd) {
      const vdinfo = nextvd.split('_');
      const videotitle = this.getvideotitle(this.state.data, vdinfo[0]);
      this.setState({
        vd: nextvd,
        id: vdinfo[0],
        vid: vdinfo[1],
        website: vdinfo[2],
        delhide: false,
        title: videotitle
      });
      // this.forceUpdate();
      console.info('onUpdateVideo');
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
        const videotitle = this.getvideotitle(json.videos, this.state.id);
        this.setState({
          data: json.videos,
          title: videotitle
        });
      } else if (json === 400 || (json && !json.isSuccess)) {
        PinstreamUtilitiesWeb.removeTokenInfoTolocalStorage();
        // window.location.href = '/';
        console.info('no data');
      }
    }).catch((ex) => {
      console.log('parsing failed', ex);
    });
  }
  onremoveresult(response) {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 400) {
      PinstreamUtilitiesWeb.removeTokenInfoTolocalStorage();
      this.props.router.push(PinstreamUtilitiesWeb.indexpage);
    }
    return null;
  }
  onremovevideo() {
    const info = PinstreamUtilitiesWeb.getTokenInfofromlocalStorage();
    if (!info) {
      return;
    }
    // if (process.env.NODE_ENV !== 'production') {
    //   fetchMock.delete('/api/v1/video', { isSuccess: true });
    // }
    const formData = new FormData();
    formData.append(PinstreamUtilitiesWeb.keys[0], info[PinstreamUtilitiesWeb.keys[0]]);
    formData.append('vid', this.state.id);

    fetch('/api/v1/video', {
      method: 'delete',
      headers: { Authorization: `Token ${info[PinstreamUtilitiesWeb.keys[1]]}` },
      body: formData
    }).then(this.onremoveresult).then(() => {
      this.setState({
        delhide: true,
        data: this.state.data.filter(item => item.id.toString() !== this.state.id)
      });
    }).catch(ex => console.log('parsing failed', ex));

  }
  getJson = () => {
    fetch('./src/static/data/videoItem.json')
      .then(res => res.json()).then((json) => {
        const videotitle = this.getvideotitle(json.videos, this.state.id);
        this.setState({
          data: json.videos,
          title: videotitle
        });
      }).catch((err) => {
        console.log('parsing failed', err);
      });
  };
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
  getvideotitle = (videos, id) => {
    let videotitle = '';
    if (videos && videos) {
      const videoinfo = videos.filter(item => item.id.toString() === id);
      if (videoinfo && videoinfo.length) {
        videotitle = videoinfo[0].title;
      }
    }
    return videotitle;
  }
  execgetvideo = (json) => {
    if (json && json.isSuccess) {
      PinstreamUtilitiesWeb.setTokenInfoTolocalStorage(json);
      this.ongetvideos();
    } else if (json === 400 || (json && !json.isSuccess)) {
      PinstreamUtilitiesWeb.removeTokenInfoTolocalStorage();
      // window.location.href = '/';
      // console.info(json);
    }
  }
  removevideo = () => {
    //todo check PinstreamUtilitiesWeb.isExpires()
    if (!confirm('你確定要取消收藏嗎？')) {
      return;
    }
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
      }).then(this.onremovevideo);
    } else {
      this.onremovevideo();
    }
  }
  render() {
    return (
      <div className="VideoPage">
        <div className="container-fluid wrapper">
          <div className="header">
            <Link to={'/VideoList'}>
              <img alt="PinStream" src={Logo} />
            </Link>
            <div className="userAvatar">
              <UserAvatar />
              <Account />
            </div>
          </div>
          <div className="VideoPageContent">
            <div className="VideoWrapper col-xs-12 col-sm-12 col-md-7 col-lg-7">
              <VideoContainer
                key={this.props.params.vd}
                vd={this.props.params.vd} />
              <div className="videoDes">
                <div className="title">
                  <h2>{this.state.title}</h2>
                </div>
                <div className="description">
                  <p>{this.state.title}</p>
                </div>
                <hr />
                <div className="subDescription">
                  <span>
                    from:
                    {(this.state.website === '0') ? <img alt="facebook" src={FacebookIcon} width="32" height="32" /> : null}
                    {(this.state.website === '1') ? <img alt="youtube" src={YoutubeIcon} width="32" height="32" /> : null}
                    {(this.state.website === '2') ? <img alt="dailymotion" src={DailymotionIcon} width="32" height="32" /> : null}
                    {(this.state.website === '3') ? <img alt="vimeo" src={Vimeo} width="32" height="32" /> : null}
                  </span>
                  <span className="deleteBtn" ><img alt="DeleteBtn" src={DeleteBtn} width="32" height="32" onClick={this.removevideo} style={{ display: this.state.delhide ? 'none' : 'block' }} /> </span>
                </div>
              </div>
              {/*<img className="adBanner" src={Banner} alt="" />*/}
            </div>
            <div className="col-xs-12 col-xs-offset-0 col-sm-12 col-sm-offset-0 col-md-5 col-lg-5 ">
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
          </div>
        </div>
      </div>
    );
  }
}

VideoPage.propTypes = {
  router: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  params: React.PropTypes.shape({
    vd: React.PropTypes.string.isRequired
  })
};
