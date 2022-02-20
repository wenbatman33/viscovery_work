import 'gsap';
import { isTouchDevice } from 'utility/DeviceTest';
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import getLang from 'utility/lang'
import config from 'constants/config'
import _ from 'lodash'

class Members extends Component {

  constructor() {
    super()
    this.state = {
      members: []
    }
    let lang = getLang();
    switch(lang) {
      case 'zh-hans': // 簡中
        this.lang = 2
        break
      case 'zh-hant': // 繁中
        this.lang = 1
        break
      case 'en':
      default:
        this.lang = 0
    }
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    if(this.state.members.length === 0) return
    // 動態效果
    new TeamSwip()
  }

  getData() {
    let apiURL = `${config.api}api/members/?lang=${this.lang}&limit=1000`
    fetch(apiURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(response => {
        let members = response.response_data.filter(item => item.activated == 1)
        // members.sort((a,b) => a.priority < b.priority)
        _.sortBy(members, (o) => o.priority)
        _.reverse(members)
        this.setState({
          members
        })
      },
      error => {
        // error
      }
    );
  }



  render() {

    return (
      <div>

        {
          this.state.members.map((item, index) => {

              return (
                <section key={item.id} className="team-block__list-block__intro-block">
                  <div className="intro-block-front">
                    <div className="avanda" style={{backgroundImage:`url(${item.profile_img_url})`}}></div>
                    <h2 className="name font-h2 color-dark">{item.name}</h2>
                    {/* <h2 className="name font-h2 color-dark">{item.name}</h2>
                    <h6 className="ch-name font-h6-sm color-dark-60a">{item.name}</h6> */}
                    <h6 className="pos font-h6 color-main-red">{item.title}</h6>
                  </div>
                  <div className="intro-block-detail" dangerouslySetInnerHTML={{__html:item.description}}></div>
                </section>
              )
          })
        }

      </div>
    )
  }
}


ReactDOM.render(
  <Members />,
  document.getElementById('memberSwiper')
)






export default class TeamSwip {

  mode = 'init';
  perspective = 3000;
  time = 0.5;
  swipPoint = 0;
  touchPoint = {x:0, y:0};
  moveX;
  touchDirection = ''; // vertical, horizontal
  touchDevice = isTouchDevice();
  swiper;
  doms;
  mobileDescription;
  touchArea;

  constructor() {
    this.mouseHandler = this.mouseHandler.bind(this);
    this.touchHandler = this.touchHandler.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
    this.swipComplete = this.swipComplete.bind(this);

    this.swiper = document.getElementById('memberSwiper');
    this.doms =  document.getElementsByClassName('team-block__list-block__intro-block');
    this.mobileDescription = document.getElementsByClassName('team-block__swiper-description')[0];
    this.touchArea = document.getElementsByClassName('team-block__list-block')[0];

    // this.swiper.style.display = null;
    for(let i=0, j=this.doms.length; i<j; i++) {
      this.doms[i].addEventListener("mouseenter", this.mouseHandler);
      this.doms[i].addEventListener("mouseover", this.mouseHandler);
      this.doms[i].addEventListener("mouseleave", this.mouseHandler);
    }
    if(this.touchDevice) {
      this.touchArea.addEventListener("touchstart", this.touchHandler);
    } else {
      this.touchArea.addEventListener("mousedown", this.touchHandler);
    }
    window.addEventListener( "resize", this.resizeEvent);
    this.resizeEvent();
  }

  mouseHandler(event) {
    if(this.mode === 'mobile') return;
    let front = event.target.getElementsByClassName('intro-block-front')[0];
    let detail = event.target.getElementsByClassName('intro-block-detail')[0];
    TweenMax.killChildTweensOf(front);
    TweenMax.killChildTweensOf(detail);
    switch(event.type) {
      case "mouseenter":
      case "mouseover": // 針對ios
        if(front) {
          TweenMax.to(front, this.time, {rotationY: 180, transformOrigin:"center center", transformPerspective: this.perspective});
          TweenMax.to(detail, this.time, {rotationY: 0, transformOrigin:"center center", transformPerspective: this.perspective});
        }
        break;
      case "mouseleave":
        TweenMax.to(front, this.time, {rotationY: 0, transformOrigin:"center center", transformPerspective: this.perspective});
        TweenMax.to(detail, this.time, {rotationY: -180, transformOrigin:"center center", transformPerspective: this.perspective});
    }
  }

  touchHandler(event) {
    if(this.mode === 'desktop') return;
    let move;
    let screenX = event.screenX !== undefined ? event.screenX : event.changedTouches[0] ? event.changedTouches[0].screenX : 0;
    let screenY = event.screenY !== undefined ? event.screenY : event.changedTouches[0] ? event.changedTouches[0].screenY : 0;
    switch(event.type) {
      case "touchstart":
      case "mousedown":
        TweenMax.killChildTweensOf(this.swiper);
        this.touchPoint = { x:screenX, y:screenY };
        this.touchDirection = '';
        this.moveX = parseInt(this.swiper.style.left.replace('px', ''));
        if(this.touchDevice) {
          this.touchArea.addEventListener("touchmove", this.touchHandler);
          this.touchArea.addEventListener("touchend", this.touchHandler);
        } else {
          this.touchArea.addEventListener("mousemove", this.touchHandler);
          this.touchArea.addEventListener("mouseup", this.touchHandler);
        }
        break;
      case "touchmove":
      case "mousemove":
        if(this.touchDirection === 'horizontal') {
          event.preventDefault();
          move = this.touchPoint.x - screenX;
          this.swiper.style.left = `${this.moveX - move}px`;
        } else if(this.touchDirection === '') {
          if(Math.max(Math.abs(this.touchPoint.x - screenX), Math.abs(this.touchPoint.y - screenY)) > 10) {
            if(Math.abs(this.touchPoint.x - screenX) > Math.abs(this.touchPoint.y - screenY)) {
              this.touchDirection = 'horizontal';
            } else {
              this.touchDirection = 'vertical';
            }
          }
        }
        break;
      case "touchend":
      case "mouseup":
        if(this.touchDirection === 'horizontal') {
          let width = window.innerWidth / 2;
          move = this.touchPoint.x - screenX;
          let newSwipPoint;
          if(move > 0) {
            newSwipPoint = this.swipPoint + Math.round(Math.abs(move)/width);
          } else {
            newSwipPoint = this.swipPoint - Math.round(Math.abs(move)/width);
          }
          newSwipPoint = newSwipPoint < 0 ? 0 : newSwipPoint > this.doms.length - 1 ? this.doms.length - 1 : newSwipPoint;
          TweenMax.to(this.swiper, 0.3, {left: (width / 2) - newSwipPoint * width, ease: Power2.easeOut});
          this.swipComplete(newSwipPoint);
        }
        if(this.touchDevice) {
          this.touchArea.removeEventListener("touchmove", this.touchHandler);
          this.touchArea.removeEventListener("touchend", this.touchHandler);
        } else {
          this.touchArea.removeEventListener("mousemove", this.touchHandler);
          this.touchArea.removeEventListener("mouseup", this.touchHandler);
        }
        break;
    }
  }

  swipComplete(newSwipPoint) {
    if(this.swipPoint !== newSwipPoint) {
      this.swipPoint = newSwipPoint;
      TweenMax.killChildTweensOf(this.mobileDescription);
      TweenMax.to(this.mobileDescription, 0.3, {opacity: 0, onComplete: () => {
        this.mobileDescription.innerHTML = this.doms[this.swipPoint].getElementsByClassName('intro-block-detail')[0].innerHTML;
        TweenMax.to(this.mobileDescription, 0.3, {opacity: 1});
      }});
    }
  }

  // Resize
  resizeEvent(event) {
    if(window.innerWidth < 768 && this.mode !== 'mobile') {
      this.mode = 'mobile';
      TweenMax.set('.intro-block-detail', {
        visibility:'visible'
      });
      TweenMax.set('.intro-block-front', {
        rotationY: 0
      });
      this.swipPoint = 0;
    } else if(window.innerWidth >= 768 && this.mode !== 'desktop'){
      this.mode = 'desktop';
      TweenMax.set('.intro-block-detail', {
        visibility:'visible',
        rotationY: -180,
        transformOrigin:"center center",
        transformPerspective: this.perspective
      });
      TweenMax.set('.intro-block-front', {
        rotationY: 0
      });
    }
    if(this.mode === 'mobile') {
      let width = window.innerWidth / 2;
      this.swiper.style.width = `${width * this.doms.length + 10}px`;
      this.swiper.style.left = `${width / 2 - (width * this.swipPoint) }px`;
      this.mobileDescription.innerHTML = this.doms[this.swipPoint].getElementsByClassName('intro-block-detail')[0].innerHTML;
    } else {
      this.swiper.style.width = null;
      this.swiper.style.left = null;
    }
  }


}
