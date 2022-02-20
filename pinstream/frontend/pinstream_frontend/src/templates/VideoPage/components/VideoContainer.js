/* global viscoveryAd*/

import React, { Component } from 'react';
import YoutubePlayer from './YoutubePlayer';
import DMplayer from './DMplayer';
import VimeoPlayer from './VimeoPlayer';
import FBplayer from './FBPlayer';

const divStyle = {
  overflow: 'hidden',
  height: '400px',
  width: '100%',
};

const emptyDivStyle = {
  padding: 'auto',
  fontSize: '20px',
};

const containerStyle = {
  position: 'relative'
};

export default class VideoContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.vd.split('_')[0],
      vid: this.props.vd.split('_')[1],
      website: this.props.vd.split('_')[2]
    };

    this._YTplayer = this._YTplayer.bind(this);
    this._DMplayer = this._DMplayer.bind(this);
    this._VMplayer = this._VMplayer.bind(this);
    this._FBPlayer = this._FBPlayer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.vd.split('_')[0],
      vid: nextProps.vd.split('_')[1],
      website: nextProps.vd.split('_')[2]
    });
  }

  _YTplayer = () => (
    <div style={containerStyle}>
      <YoutubePlayer ytp_id={this.state.vid} />
    </div>
  );

  _DMplayer = () => (
    <div style={containerStyle}>
      <DMplayer dm_id={this.state.vid} />
    </div>
  );

  _VMplayer = () => (
    <div style={containerStyle}>
      <VimeoPlayer vm_id={this.state.vid} />
    </div>
  );

  _FBPlayer = () => (
    <div style={containerStyle}>
      <FBplayer fb_id={this.state.vid} />
    </div>
  );

  render() {
    switch (this.state.website) {
      case '0':
        return this._FBPlayer();
      case '1':
        return this._YTplayer();
      case '2':
        return this._DMplayer();
      case '3':
        return this._VMplayer();
      default:
        return (
          <div style={divStyle}>
            <div style={emptyDivStyle}>
              <span> 您所搜尋的影片不存在 : ( </span>
            </div>
          </div>
        );
    }
  }
}

VideoContainer.propTypes = {
  vd: React.PropTypes.string
};
