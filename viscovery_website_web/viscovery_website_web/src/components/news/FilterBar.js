import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getLang from 'utility/lang'
import classnames from 'classnames'
import { getYears, searchNews, clearNews, setSearchYear, setKeyword } from 'actions/search'

class FilterBar extends Component {

  constructor() {
    super()
    this.filterbarOnClick = this.filterbarOnClick.bind(this)
    this.searchOnClick = this.searchOnClick.bind(this)
    this.onYearClickBody = this.onYearClickBody.bind(this)
    this.onSearchClickBody = this.onSearchClickBody.bind(this)
    this.changeYear = this.changeYear.bind(this)
    this.submit = this.submit.bind(this)
    this.state = {
      filterBl: false,
      searchBl: false
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
    this.props.getYears();
    this.props.searchNews({
      year   : '',
      keyword: '',
      offset : 0,
      lang   : this.lang
    })
  }

  filterbarOnClick(){
    if( this.state.filterBl == true ){
      this.setState({ filterBl:false })
      document.body.removeEventListener("click", this.onYearClickBody)
    }else{
      this.setState({ filterBl:true })
      document.body.addEventListener("click", this.onYearClickBody, false)
    }
  }

  checkInsideDOM(target, isTarget) {
    return isTarget === target ? true : target === null ? false : this.checkInsideDOM(target.parentNode, isTarget);
  }

  onYearClickBody(event) {
    if(!this.checkInsideDOM(event.target, this.refs.yearSelecter)) {
      this.setState({ filterBl:false })
      document.body.removeEventListener("click", this.onYearClickBody)
		}
  }

  searchOnClick(){
    if( this.state.searchBl == true ){
      // this.setState({ searchBl:false })
      // document.body.removeEventListener("click", this.onSearchClickBody)
    }else{
      this.setState({ searchBl:true })
      document.body.addEventListener("click", this.onSearchClickBody, false)
    }
  }

  onSearchClickBody(event) {
    if(!this.checkInsideDOM(event.target, this.refs.searchInput)) {
      this.setState({ searchBl:false })
      document.body.removeEventListener("click", this.onSearchClickBody)
    }
  }

  changeYear(year) {
    if(year == this.props.searchYear) return
    this.props.clearNews()
    this.props.setSearchYear(year)
    this.props.searchNews({
      year   : year,
      keyword: this.props.keyword || '',
      offset : 0,
      lang   : this.lang
    })
  }

  submit(event){
    event.preventDefault()
    console.log(123)
    let keyword = this.refs.keyword.value.trim()
    if(keyword == this.props.keyword) return

    this.props.clearNews()
    this.props.setKeyword(keyword)
    this.props.searchNews({
      year   : this.props.searchYear,
      keyword: keyword || '',
      offset : 0,
      lang   : this.lang
    })
  }

  render() {
    let { yearList, searchYear } = this.props;
    let lang = getLang();
    let allYear, searchBtnText;
    switch(lang) {
      case 'zh-hans': // 簡中
        allYear = '全部年份'
        searchBtnText = '搜寻文章'
        break
      case 'zh-hant': // 繁中
        allYear = '全部年份'
        searchBtnText = '搜尋文章'
        break
      case 'en':
      default:
        allYear = 'All'
        searchBtnText = 'Search'
    }

    return (
      <div className="news-container__filter-bar">

        <div ref="yearSelecter" onClick={ this.filterbarOnClick } className={`select-round ${this.state.filterBl == true ? 'select-round--selected' : ''} `}>
          <p className="select-round__selected-title">
            { searchYear == '' ? allYear : searchYear }
          </p>

          <ul className={`select-round__select-list ${this.state.filterBl == false ? 'select-round__select-list--none' : ''} `}>
            <li onClick={this.changeYear.bind(this, '')} className={classnames('select-round__select-list__list', {'select-round__select-list__list--selected': searchYear == ''})}>{allYear}</li>
            {
              yearList.map((item, index) => {
                return (
                  <li key={item} onClick={this.changeYear.bind(this, item)} className={classnames('select-round__select-list__list', {'select-round__select-list__list--selected': searchYear == item})}>{item}</li>
                )
              })
            }
          </ul>

        </div>

        <div ref="searchInput" onClick={ this.searchOnClick } className={`news-container__filter-bar__search btn-search ${this.state.searchBl == true ? 'btn-search--selected' : ''}`}>
          <form onSubmit={this.submit} className="btn-search__form">
            <input ref="keyword" className="btn-search__input" type="text" placeholder={searchBtnText} />
          </form>
        </div>

      </div>
    )
  }
}


export default connect(
  state => ({
    yearList  : state.searchData.yearList,
    searchYear: state.searchData.searchYear,
    keyword   : state.searchData.keyword
  }),
  dispatch => bindActionCreators({
    getYears, searchNews, clearNews, setSearchYear, setKeyword
  }, dispatch)
)(FilterBar)
