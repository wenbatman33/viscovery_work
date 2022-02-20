import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getLang from 'utility/lang'
import { getYears, searchNews } from 'actions/search'
import moment from 'moment'
import config from 'constants/config'

class SearchContent extends Component {
  constructor() {
    super()
    this.loadMore = this.loadMore.bind(this)
    let lang = getLang();
    switch(lang) {
      case 'zh-hans': // 簡中
        this.lang = 2
        this.base = '/zh-cn/'
        moment.locale('zh-cn')
        break
      case 'zh-hant': // 繁中
        this.lang = 1
        this.base = '/zh-tw/'
        moment.locale('zh-tw')
        break
      case 'en':
      default:
        this.lang = 0
        this.base = '/'
        moment.locale('en')
    }
  }

  componentDidMount() {

  }

  loadMore() {
    let { searchYear, newsData, keyword } = this.props
    this.props.searchNews({
      year   : searchYear || '',
      keyword: keyword || '',
      offset : newsData.response_data.length,
      lang   : this.lang
    })
  }

  strip(html) {
    let tmp = document.createElement("DIV")
    tmp.innerHTML = html
    let text = tmp.textContent || tmp.innerText || ""
    text = text.replace(/\n/g, '')
    return text.trim()
  }

  render() {
    let { newsData, searchYear, keyword } = this.props;
    let lang = getLang();

    return (
      <div>
        {/* title */}
        <section className="search-result-bar">
          <div className="search-result-bar__content">
            { keyword ? <h6 className="search-result-bar__content__title font-h2 color-main-red">”{keyword}“</h6> : null }
            { lang === 'zh-hans' ? <p className="search-result-bar__content__txt font-h6-sm{ color-dark">找到 <span className="color-main-red">{newsData.total_count}</span> 篇文章</p> : null }
            { lang === 'zh-hant' ? <p className="search-result-bar__content__txt font-h6-sm{ color-dark">找到 <span className="color-main-red">{newsData.total_count}</span> 篇文章</p> : null }
            { lang === 'en' ? <p className="search-result-bar__content__txt font-h6-sm{ color-dark">About <span className="color-main-red">{newsData.total_count}</span> results</p> : null }
          </div>
        </section>

        {/* list content */}
        <div className="news-container__content">

          {/* News List Block [start] */}
          <div className="news-list-block">

            {/* List */}
            {
              newsData.response_data.map((item, index) => {
                let link = `${this.base}news-article?id=${item.id}`
                let date = moment(item.created_time).format('MMM DD,YYYY')

                return (
                  <div key={item.id} className="news-list-block__list col-sm-6 col-md-4">
                    <section className="list-block">
                      <a href={link} className="nav-block photo-block" target="_self">
                        <div className="list-block__photo" style={{backgroundImage:`url(${item.img_url})`}}></div>
                      </a>
                      <div className="list-block__content">
                        <a href={link} className="nav-block" target="_self">
                          <h3 className="title font-h3 color-dark">{item.name ? item.name : ''}</h3>
                        </a>
                        {/* <p className="text font-p-lg color-dark-60a">{item.context ? this.strip(item.context).slice(0,90) : ''}</p> */}
                        <p className="text font-p-lg color-dark-60a">{item.intro || ''}</p>
                      </div>
                      <time className="list-block__time font-p-md color-dark" dateTime={date}>{date}</time>
                    </section>
                  </div>
                )
              })
            }

          </div>  {/* News List Block [end] */}

          { lang === 'zh-hans' ? newsData.total_count <= newsData.response_data.length ? null : <a onClick={this.loadMore} className="btn-more">载入更多</a> : null }
          { lang === 'zh-hant' ? newsData.total_count <= newsData.response_data.length ? null : <a onClick={this.loadMore} className="btn-more">載入更多</a> : null }
          { lang === 'en' ?      newsData.total_count <= newsData.response_data.length ? null : <a onClick={this.loadMore} className="btn-more">More</a> : null }


        </div>
      </div>
    )
  }
}




export default connect(
  state => ({
    newsData  : state.searchData.newsData,
    searchYear: state.searchData.searchYear,
    keyword   : state.searchData.keyword
  }),
  dispatch => bindActionCreators({
    getYears, searchNews
  }, dispatch)
)(SearchContent)
