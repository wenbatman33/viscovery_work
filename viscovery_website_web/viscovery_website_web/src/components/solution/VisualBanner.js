import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import getLang from 'utility/lang'
import MediaQuery from 'react-responsive'
import Slider from 'react-slick'
import config from 'constants/config'
import _ from 'lodash'

class VisualBanner extends Component {

  page = document.getElementById('solutionSubMenu').getAttribute('data-select')

  constructor() {
    super()
    this.gotoSwip = this.gotoSwip.bind(this)
    this.afterChange = this.afterChange.bind(this)
    this.state = {
      selectIndex: 0,
      category: '',
      bannerList: []
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

  getMedia(item) {
    if(item.youku_url === null && item.youtube_url === null) {
      if(item.sub_img_url === null) return null
      else return { type: 'image', src: item.sub_img_url }
    } else if(item.youtube_url != null) {
      return { type: 'youtube', src: item.youtube_url, img: item.sub_img_url }
    } else if(item.youku_url != null) {
      return { type: 'youku', src: item.youku_url, img: item.sub_img_url }
    } else {
      return null
    }
  }

  getData(offset=0) {
    let solutionID = document.getElementById('visualBanner').getAttribute('solution-id') || ''
    if(solutionID === '') return

    let apiURL = `${config.api}api/cases/?lang=${this.lang}&solution_id=${solutionID}&activated=1&limit=100&offset=${offset}`
    fetch(apiURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(response => {
        let bannerList = this.state.bannerList
        response.response_data.map((item, index) => {
          bannerList.push({
            id: item.id,
            category: item.name,
            description: item.main_context,
            media: this.getMedia(item),
            background: item.main_img_url,
            priority: item.priority
          })
        })
        // 排序
        // bannerList.sort((a,b) => a.priority < b.priority)
        _.sortBy(bannerList, (o) => o.priority)
        _.reverse(bannerList)

        this.setState({ bannerList, category:bannerList[0].category })
        // console.log(bannerList)
        // 還有資料
        if(response.response_data.length > 0 && response.total_count > bannerList.length) {
          this.getData(bannerList.length)
        }
      },
      error => {
        // error
      }
    );
  }

  gotoIndex(value) {
    this.refs.slider.slickGoTo(value)
  }

  gotoSwip(value) {
    switch(value) {
      case 'prev':
        this.refs.slider.slickPrev()
        break;
      case 'next':
        this.refs.slider.slickNext()
        break;
    }
  }

  afterChange(index) {
    this.setState({
      selectIndex: index,
      category: this.state.bannerList[index].category
    })
  }

  renderBanner() {
    return this.state.bannerList.map((item, index) => {
      return (
        <div key={item.id} className={classnames('visual-banner__content', {'visual-banner--none-content': item.media === null})} style={{backgroundImage: `url(${item.background})`}}>

          <div className="container-med">
            <div className="middle-block">
              {
                item.media === null ? null :
                  <div className="visual-banner__intro-block">
                    <h6 className="visual-banner__intro-block__info-title font-h6-sm color-white">{item.description}</h6>
                    { item.media.type === 'image' ? <img className="visual-banner__intro-block__info-photo" src={item.media.src} /> : null }
                    {
                      item.media.type === 'youtube' ?
                      <div style={{position: 'relative'}}>
                        <img className="visual-banner__intro-block__empty-photo" src={item.media.img || 'imgs/solution-empty.png'} />
                        {
                          this.state.selectIndex === index ?
                            <iframe className="visual-banner__intro-block__info-video" src={`https://www.youtube.com/embed/${item.media.src}?rel=0&amp;showinfo=0`} frameBorder="0" allowFullScreen></iframe>
                            : null
                        }
                      </div>
                      : null
                    }
                    {
                      item.media.type === 'youku' ?
                      <div style={{position: 'relative'}}>
                        <img className="visual-banner__intro-block__empty-photo" src="imgs/solution-empty.png" />
                        {
                          this.state.selectIndex === index ?
                            <iframe className="visual-banner__intro-block__info-video" src={`http://player.youku.com/embed/${item.media.src}`} frameBorder="0" allowFullScreen></iframe>
                            : null
                        }
                      </div>
                      : null
                    }
                  </div>
              }
            </div>
          </div>

        </div>
      )
    })
  }

  render() {
    if(this.state.bannerList.length === 0) return <div></div>

    let lang = getLang()
    let page = document.documentElement.getAttribute('data-page')
    let title;
    switch(lang) {
      case 'zh-hans': // 簡中
        title = '合作案例'
        break
      case 'zh-hant': // 繁中
        title = '合作案例'
        break
      case 'en':
      default:
        title = 'Case'
    }

    let settings = {
      // infinite: false,
      speed: 500,
      variableWidth: false,
      adaptiveHeight: false,
      arrows: false,
      draggable: false,
      afterChange: this.afterChange
    };

    let sliderStyle = {}
    if(this.state.bannerList.length <= 1) sliderStyle.pointerEvents = 'none'


    return (
      <div>
        <div className="container-med">
          <h2 className="banner-title font-h2-lg color-dark">{title}</h2>
          <h2 className="banner-sub-title font-h2-lg color-main-red">{this.state.category}</h2>
        </div>

        {/* Visual Banner */}
        <div className="visual-banner" style={sliderStyle}>
          <Slider ref='slider' {...settings}>
            { this.renderBanner() }
          </Slider>

          {
            this.state.bannerList.length <= 1 ? null :
              <div className="visible-xs visual-banner__dots">
                {
                  this.state.bannerList.map((item, index) => {
                    return <a key={index} onClick={this.gotoIndex.bind(this, index)} className={classnames('page-list__round', {'page-list__round--on': this.state.selectIndex === index})}></a>
                  })
                }
              </div>
          }

          { this.state.bannerList.length > 1 ? <a onClick={this.gotoSwip.bind(this, 'prev')} className="visual-banner__arrow visual-banner__arrow__prev hidden-xs"></a> : null }
          { this.state.bannerList.length > 1 ? <a onClick={this.gotoSwip.bind(this, 'next')} className="visual-banner__arrow visual-banner__arrow__next hidden-xs"></a> : null }

        </div>

      </div>
    )
  }
}


ReactDOM.render(
  <VisualBanner />,
  document.getElementById('visualBanner')
)
