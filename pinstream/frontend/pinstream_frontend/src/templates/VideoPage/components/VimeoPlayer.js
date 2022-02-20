/*global Vimeo*/
/* global viscoveryAd*/

import React from 'react';

const divStyle = {
  overflow: 'hidden',
  height: '400px',
  width: '100%',
};

class VimeoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.vimeoPlayerInit = this.vimeoPlayerInit.bind(this);
    this._returnUpdatedTime = this._returnUpdatedTime.bind(this);
    this.viscoveryAdIntegrate = this.viscoveryAdIntegrate.bind(this);
    this.state = {
      player: null,
    };
  }

  componentDidMount() {
    this.vimeoPlayerInit();
  }

  vimeoPlayerInit = () => {
    const player = new Vimeo.Player('vimeo-content-player', {
      height: divStyle.height,
      id: this.props.vm_id,
      autoplay: false,
    });

    player.on('loaded', () => {
      player.element.style.width = '100%';
    });

    player.play().then(() => {
      this.viscoveryAdIntegrate();
    });

    this.setState({player});
  }

  _returnUpdatedTime = (updateTrigger) => {
    this.state.player.on('timeupdate', (data) => {
      updateTrigger(data.seconds);
    });
  };

  viscoveryAdIntegrate = () => {
    console.log('%c Viscovery Ad SDK initiate ', 'background: #2E2E2E; color: #F37D63; padding: 1px;');
    viscoveryAd.init({
      contentPlayer: '#vimeo-content-player',
      adContainer: '#vimeo-adContainer',
      outStreamContainer: '#outstream',
      apiKey: '873cbd49-738d-406c-b9bc-e15588567b39',
      videoId: '0817',
      playerControl: {
        play: this.state.player.play.bind(this.state.player),
        pause: this.state.player.pause.bind(this.state.player),
        getCurrentTime: this.state.player.getCurrentTime.bind(this.state.player),
        getPaused: this.state.player.getPaused.bind(this.state.player),
        onTimeUpdate: this._returnUpdatedTime,
      },
      bottomOffset: 50,
      mobileFullscreenHacking: true,
    });
  }

  render() {
    return (
      <div style={divStyle}>
        <div id="vimeo-content-player" />
        <div id="vimeo-adContainer" className="adContainer" />
      </div>
    );
  }
}

VimeoPlayer.propTypes = {
  vm_id: React.PropTypes.string,
};

export default VimeoPlayer;
