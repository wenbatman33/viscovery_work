import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import 'gsap';
import { isTouchDevice } from 'utility/DeviceTest';
import getLang from 'utility/lang';
import MediaQuery from 'react-responsive'
import Slider from 'react-slick'
import { addClass, removeClass } from 'utility/IE8ClassList'
import config from 'constants/config'
import _ from 'lodash'

class PartnerList extends Component {

  desktopLogoNum = 20;
  mobileLogoNum = 9;
  autoPlay = true;
  mode = 'init';

  constructor(props) {
    super()
    this.renderDots = this.renderDots.bind(this);
    this.renderPartnars = this.renderPartnars.bind(this);
    this.afterChange = this.afterChange.bind(this);
    this.mouseHandler = this.mouseHandler.bind(this);
    this.tick = this.tick.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);

    // let partners = []
    // let imgs = props.target.getElementsByTagName('img')
    // for(let i=0, j=imgs.length; i<j; i++) {
    //   partners.push(imgs[i].getAttribute('src'))
    // }

    this.firstEnter = true;
    this.state = {
      selectIndex: 0,
      partners: [],
      show: false
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
    this.getData();
  }

  componentDidUpdate() {
    if(this.refs.area && this.firstEnter) {
      this.firstEnter = false
      this.interval = setInterval(() => this.tick(), 1000 * 7)
      this.refs.area.addEventListener("mouseenter", this.mouseHandler)
      this.refs.area.addEventListener("mouseleave", this.mouseHandler)
      window.addEventListener( "resize", this.resizeEvent)
      this.resizeEvent()
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  getData(offset=0) {
    let apiURL = `${config.api}api/partners/?lang=${this.lang}&limit=1000&activated=1&offset=${offset}`
    fetch(apiURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(response => {
        let partners = this.state.partners
        response.response_data.map((item, index) => {
          partners.push(item)
        })
        // 排序
        // partners.sort((a,b) => a.priority < b.priority)
        _.sortBy(partners, (o) => o.priority)
        _.reverse(partners)

        // 還有資料
        if(response.response_data.length > 0 && response.total_count > partners.length) {
          this.setState({ partners })
          this.getData(partners.length)
        } else {
          this.setState({ partners, show: true })
        }
      },
      error => {
        // error
      }
    );
  }

  resizeEvent(event) {
    if(window.innerWidth < 768 && this.mode !== 'mobile') {
      this.mode = 'mobile';
      this.setState({ selectIndex: 0 })
    } else if(window.innerWidth >= 768 && this.mode !== 'desktop'){
      this.mode = 'desktop';
      this.setState({ selectIndex: 0 })
    }
  }

  tick() {
    if(this.autoPlay && this.mode === 'desktop') this.gotoIndex(this.state.selectIndex + 1)
  }

  mouseHandler(event) {
    switch(event.type) {
      case "mouseenter":
        this.autoPlay = false
        break;
      case "mouseleave":
        this.autoPlay = true
    }
  }

  gotoIndex(value) {
    this.refs.slider.slickGoTo(value)
  }

  afterChange(index) {
    this.setState({
      selectIndex: index
    })
  }

  renderDots(num) {
    let html = [];
    for(let i=0; i<=this.state.partners.length / num; i++) {
      html.push(<a key={i} onClick={this.gotoIndex.bind(this, i)} className={classnames('page-list__round', {'page-list__round--on': this.state.selectIndex === i})}></a>);
      // html.push(<a key={i} onClick={this.gotoIndex.bind(this, i)} className={classnames('page-list__round', {'page-list__round--on': i === 0})}></a>);
      // html.push(<a key={i} onClick={this.gotoIndex.bind(this, i)} className="page-list__round"></a>);
    }
    return html;
  }

  renderPartnarItem(count, num) {
    let html = [];
    for(let i=count * num; i<count * num + num; i++) {
      if(i >= this.state.partners.length) break;
      html.push(
        <li key={i} className="partner-block__logo__list">
          <div className="nav-block" style={{pointerEvents: 'none'}}>
            <img className="logo-img" src={ this.state.partners[i].logo_url } />
          </div>
        </li>
      )
    }
    return html;
  }

  renderPartnars(num) {
    let html = [];
    for(let i=0; i<=this.state.partners.length / num; i++) {
      html.push(
        <ul key={i} className="partner-block__logo">
          { this.renderPartnarItem(i, num) }
        </ul>
      );
    }
    return html;
  }

  render() {
    let settings = {
      infinite: true,
      speed: 500,
      variableWidth: false,
      adaptiveHeight: false,
      arrows: false,
      // autoplay: true,
      // autoplaySpeed: 5000,
      afterChange: this.afterChange
    };

    if(!this.state.show) return <div></div>;

    return (
      <div ref="area">

        {/* 3 * 3 */}
        <MediaQuery maxWidth={768-1}>
          <Slider ref="slider" {...settings}>
            { this.renderPartnars(this.mobileLogoNum) }
          </Slider>
          <div className="page-list" ref="dots">
            { this.renderDots(this.mobileLogoNum) }
          </div>
        </MediaQuery>

        {/* 5 * 4 */}
        <MediaQuery minWidth={768}>
          <Slider ref="slider" {...settings}>
            { this.renderPartnars(this.desktopLogoNum) }
          </Slider>
          <div className="page-list" ref="dots">
            { this.renderDots(this.desktopLogoNum) }
          </div>
        </MediaQuery>

      </div>
    )
  }
}




ReactDOM.render(
  <PartnerList target={document.getElementById('partners')} />,
  document.getElementById('partners')
)
