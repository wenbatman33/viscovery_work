import React, { Component } from 'react';
import { Link } from 'react-router';
import FacebookIcon from '../../../static/img/icon_facebook@2x.png';
import YoutubeIcon from '../../../static/img/icon_youtube@2x.png';
import DailymotionIcon from '../../../static/img/icon_dailymotion@2x.png';
import Vimeo from '../../../static/img/icon_vimeo@2x.png';

export default class VideoItem extends Component {
  render() {
    return (
      <div className="VideoItem col-xs-6 col-sm-4 col-md-3 col-lg-3">
        <Link to={`/VideoPage/${this.props.id}_${this.props.website_vid}_${this.props.website}`}>
          <div className="VideoItemInner">
            <div className="videoImgWrapper">
              <img className="videoImg" alt="" src={this.props.imgurl} />
            </div>
            <div className="videoInfoWrapper">
              <div className="title">
                <h2>{this.props.title} </h2>
              </div>
              <div className="description">
                <p>{this.props.title}</p>
              </div>
              <div className="subDescription">
                {/*View：99*/}
                <span className="channelIcon">
                  {(this.props.website === '0') ? <img alt="facebook" src={FacebookIcon} width="32" height="32"/> : null }
                  {(this.props.website === '1') ? <img alt="youtube" src={YoutubeIcon} width="32" height="32"/> : null }
                  {(this.props.website === '2') ? <img alt="dailymotion" src={DailymotionIcon} width="32" height="32"/> : null }
                  {(this.props.website === '3') ? <img alt="vimeo" src={Vimeo} width="32" height="32"/> : null }
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

VideoItem.propTypes = {
  imgurl: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  id: React.PropTypes.number.isRequired,
  website: React.PropTypes.string.isRequired,
  website_vid: React.PropTypes.string.isRequired
};
