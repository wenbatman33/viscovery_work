import React, { Component } from 'react';
/*global FB*/
/*global DM*/
/*global viscoveryAd*/
const divStyle = {
  overflow: 'hidden',
  height: '400px',
  width: '100%',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px'
};

export default class VideoContainer extends Component {
  constructor(props) {
    super(props);
    this.getembed = this.getembed.bind(this);
    const vdinfo = this.props.vd.split('_');
    this.state = {
      id: vdinfo[0],
      vid: vdinfo[1],
      website: vdinfo[2]
    };
    this.viscoveryplay = this.viscoveryplay.bind(this);
  }
  componentDidMount() {
    if (this.state.website === '2') {
      this.dailymotionplay();
    }
  }
  getembedContainer() {
    switch (this.state.website) {
      case '0':
        setTimeout(() => {
          if (FB) {
            FB.XFBML.parse();
          }
        }, 500);
        return <div className="fb-video" data-href={`https://www.facebook.com/facebook/videos/${this.state.vid}`} data-height="400" data-show-text="false" />;
      case '2':
        return (<div id="container">
          <div id="content">
            <div id="player" />
          </div>
          <div id="adContainer" />
          <div id="outstream" />
        </div>);
      default:
        return <iframe id="modal-iframe" className="embed-responsive-item" src={this.getembed()} data-id={this.state.id} style={divStyle} />;
    }
  }
  getembed() {
    switch (this.state.website) {
      case '0':
        return `https://www.facebook.com/facebook/videos/${this.state.vid}`;
      case '1':
        return `https://www.youtube.com/embed/${this.state.vid}`;
      case '2':
        return `https://www.dailymotion.com/embed/video/${this.state.vid}`;
      case '3':
        return `https://player.vimeo.com/video/${this.state.vid}`;
      default:
        return 'https://www.dailymotion.com/embed/video/k75IFFCiAXYXA8nGL8G';
    }
  }
  viscoveryplay(e) {
    const player = e.target;
    viscoveryAd.init({
      contentPlayer: '#player',
      adContainer: '#adContainer',
      outStreamContainer: '#outstream',
      apiKey: 'c2a5756a-f5c4-374f-8af8-498447924d2a',
      videoUrl: encodeURIComponent(this.getembed()),
      playerControl: {
        play: player.play,
        pause: player.pause,
        getSeeking: player.getSeeking,
        getCurrentTime: player.getCurrentTime,
        getPaused: player.getPaused
      },
      bottomOffset: 30,
      mobileFullscreenHacking: true,
    });
  }
  dailymotionplay() {
    const player = DM.player(document.getElementById('player'), {
      video: this.state.vid,
      width: '100%',
      height: '400',
      params: {
        autoplay: false,
        mute: false,
        controls: true,
      }
    });
    // player.addEventListener('video_start', function (event) {
    //   viscoveryAd.init({
    //     contentPlayer: '#player',
    //     adContainer: '#adContainer',
    //     outStreamContainer: '#outstream',
    //     apiKey: '873cbd49-738d-406c-b9bc-e15588567b39',
    //// <apiKey> : the applied api key of viscoveryAd
    //     videoId: '00000',
    //     //   videoId: 'video-id',
    //     playerControl: {
    //       play: player.play,
    //       pause: player.pause,
    //       getSeeking: player.getSeeking,
    //       getCurrentTime: player.getCurrentTime,
    //       getPaused: player.getPaused
    //     },
    //     bottomOffset: 30,
    //     mobileFullscreenHacking: true,
    //   });
    // })
    player.addEventListener('video_start', this.viscoveryplay);
  }
  render() {
    return (
      <div>
        {this.getembedContainer()}
      </div>
    );
  }
}

VideoContainer.propTypes = {
  vd: React.PropTypes.string
};
