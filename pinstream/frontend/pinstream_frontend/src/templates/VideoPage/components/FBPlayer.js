import React, { Component } from 'react';

/*window*/
/*global FB*/
/*global viscoveryAd*/

const divStyle = {
  overflow: 'hidden',
  height: '400px',
  width: '100%',
};

class FBplayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      oldTime: 0,
      isPaused: true,
    };

    this.playerOnload = this.playerOnload.bind(this);
    this._returnUpdatedTime = this._returnUpdatedTime.bind(this);
    this._onPlayed = this._onPlayed.bind(this);
    this._onPaused = this._onPaused.bind(this);
    this.viscoveryAdIntegrate = this.viscoveryAdIntegrate.bind(this);
  }

  componentDidMount() {
    let localFB = false;
    while (window.FB !== undefined) {
      localFB = FB;
      break;
    }
    while (localFB) {
      FB.XFBML.parse();
      this.playerOnload();
      break;
    }
  }

  playerOnload = () => {
    FB.Event.subscribe('xfbml.ready', (msg) => {
      if (msg.type === 'video') {
        this.setState({player: msg.instance}, () => {
          this.viscoveryAdIntegrate();
          this.state.player.subscribe('startedPlaying', this._onPlayed);
          this.state.player.subscribe('paused', this._onPaused);
        });
      }
    });
  }

  _returnUpdatedTime = (updateTrigger) => {
    setInterval(() => {
      if (this.state.oldTime !== this.state.player.$VideoController3.$VideoCache3) {
        updateTrigger(this.state.player.$VideoController3.$VideoCache3);
        this.setState({
          ...this.state,
          oldTime: this.state.player.$VideoController3.$VideoCache3
        });
      }
    }, 1000);
  }

  _onPlayed = () => {
    this.setState({isPaused: false});
  }

  _onPaused = () => {
    this.setState({isPaused: true});
  }

  viscoveryAdIntegrate = () => {
    console.log('%c Viscovery Ad SDK initiate ', 'background: #2E2E2E; color: #F37D63; padding: 1px;');
    viscoveryAd.init({
      contentPlayer: '#facebook-content-player',
      adContainer: '#facebook-adContainer',
      outStreamContainer: '#outstream',
      apiKey: '873cbd49-738d-406c-b9bc-e15588567b39',
      videoId: '0817',
      playerControl: {
        play: this.state.player.play,
        pause: this.state.player.pause,
        getCurrentTime: () => this.state.player.$VideoController3,
        getPaused: () => this.state.isPaused,
        onTimeUpdate: this._returnUpdatedTime.bind(this),
      },
      bottomOffset: 30,
      mobileFullscreenHacking: true,
    });

  }

  render() {
    const dataHref = `https://www.facebook.com/facebook/videos/${this.props.fb_id}`;
    return (
      <div style={divStyle}>
        <div
          id="facebook-content-player"
          data-href={dataHref}
          className="fb-video"
          data-height={divStyle.height.split('px')[0]}
          data-show-text="false"
        />
        <div id="facebook-adContainer" className="adContainer" />
      </div>
    );
  }
}

FBplayer.propTypes = {
  fb_id: React.PropTypes.string,
};

export default FBplayer;
