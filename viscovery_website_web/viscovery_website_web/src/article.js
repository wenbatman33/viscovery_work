import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import getLang from 'utility/lang'
import config from 'constants/config'
import { getUrlQuery } from 'utility/encodeQueryData'
import moment from 'moment'

class Article extends Component {

  constructor() {
    super()

    this.state = {
      data: null,
      nextData: null,
      prevData: null
    }

    let lang = getLang();
    switch(lang) {
      case 'zh-hans': // 簡中
        moment.locale('zh-cn')
        this.base = '/zh-cn/'
        break
      case 'zh-hant': // 繁中
        moment.locale('zh-tw')
        this.base = '/zh-tw/'
        break
      case 'en':
      default:
        moment.locale('en')
        this.base = '/'
    }
  }

  componentDidMount() {

    let apiURL = `${config.api}api/feeds/${getUrlQuery().id}`
    fetch(apiURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(response => {
        if(response.response_data === undefined) {
          location.href = `${this.base}news`;
        } else {
          this.setState({
            data: response.response_data
          })
          if(response.response_data.next_id != null) this.moreArticle(response.response_data.next_id, 'next')
          if(response.response_data.prev_id != null) this.moreArticle(response.response_data.prev_id, 'prev')
        }
      },
      error => {
        // error

      }
    )
  }

  moreArticle(id, type) {
    let apiURL = `${config.api}api/feeds/${id}`
    fetch(apiURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(response => {
        switch(type) {
          case 'next':
            this.setState({
              nextData: response.response_data
            })
            break
          case 'prev':
            this.setState({
              prevData: response.response_data
            })
            break
        }
      },
      error => {
        // error

      }
    )
  }

  render() {
    let { data, nextData, prevData } = this.state
    if(data === null) return <div></div>

    return (
      <div>
        {/* Hero Block */}
        <div className="hero-block" style={{backgroundImage:`url(${data.img_url})`}}>

          <div className="title-block">
            <div className="title-block__last-tag font-p-sm color-white">Latest News</div>
            <time className="title-block__time font-p-md color-white" dateTime={data.created_time}>{ moment(data.created_time).format('MMM DD,YYYY') }</time>
            <h1 className="title-block__title font-h1-xl color-white">{ data.name }</h1>
          </div>

        </div>

        {/* Content Block [start] */}
        {/* <div className="container-sm news-article-main__container">
          <p>
            <h1>WMMS 2017全球移動營銷峰會及金梧獎營銷大賞於近日在上海銀星皇冠假日酒店順利舉行。</h1><br/>
            <h2>WMMS 2017全球移動營銷峰會及金梧獎營銷大賞於近日在上海銀星皇冠假日酒店順利舉行。</h2><br/>
            <strong>WMMS 2017全球移動營銷峰會及金梧獎營銷大賞於近日在上海銀星皇冠假日酒店順利舉行。</strong><br/>
            WMMS 2017全球移動營銷峰會及金梧獎營銷大賞於近日在上海銀星皇冠假日酒店順利舉行。<br/>
            <em>WMMS 2017全球移動營銷峰會及金梧獎營銷大賞於近日在上海銀星皇冠假日酒店順利舉行。</em><br/>
            <s>WMMS 2017全球移動營銷峰會及金梧獎營銷大賞於近日在上海銀星皇冠假日酒店順利舉行。</s><br/>
          </p>
        </div> */}
        <div className="container-sm news-article-main__container" dangerouslySetInnerHTML={{ __html: data.context || '' }}>

        </div>

        {/* Content Block [start] */}
        {
          prevData === null && nextData === null ? null :
            <div className="container-med news-article-main__bottom-block">

              <ul className="recently-news-list">
                {
                  prevData === null ? null :
                    <li className="recently-news-list__list">
                      <time className="recently-news-list__list__time font-p-md color-dark-60a" dateTime={prevData.created_time}>{ moment(prevData.created_time).format('MMM DD,YYYY') }</time>
                      <a className="nav-block" href={`${this.base}news-article?id=${prevData.id}`} target="_self">
                        <h6 className="recently-news-list__list__title font-h6 color-dark">{ prevData.name }</h6>
                      </a>
                    </li>
                }
                {
                  nextData === null ? null :
                    <li className="recently-news-list__list">
                      <time className="recently-news-list__list__time font-p-md color-dark-60a" dateTime={nextData.created_time}>{ moment(nextData.created_time).format('MMM DD,YYYY') }</time>
                      <a className="nav-block" href={`${this.base}news-article?id=${nextData.id}`} target="_self">
                        <h6 className="recently-news-list__list__title font-h6 color-dark">{ nextData.name }</h6>
                      </a>
                    </li>
                }
              </ul>

            </div>
        }

      </div>
    )
  }
}


ReactDOM.render(
  <Article />,
  document.getElementById('article')
)
