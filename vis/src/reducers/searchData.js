import * as types from 'constants/actionTypes';
import _ from 'lodash'


let defaultState = {
  yearList: [],
  searchYear: '',
  keyword: '',
  newsData: {
    total_count: 0,
    response_data: [
      // { photo: 'imgs/photo/news-photo-01.jpg', title: 'Viscovery携手明基智能，打造智慧零售新时代', description: 'Viscovery以其深度学习影音辨识核心技术与明基智能合作，在2017年3月5-9号的德国Euroshop...', date: '十二月 20, 2016', link: 'news-article.html' },
      // { photo: 'imgs/photo/news-photo-03.jpg', title: 'Viscovery获“2016最具发展潜力”奖，人工智能+视频广告成明年新热点', description: 'Viscovery以其深度学习影音辨识核心技术与明基智能合作，Viscovery以其深度学习影音辨识核心技术与明基智能合作，Viscovery以其深度学习影音辨识核心技术与明基智能合作，在2017年3月5-9号的德国Euroshop...', date: '十二月 20, 2016', link: 'news-article.html' },
      // { photo: 'imgs/photo/news-photo-02.jpg', title: '花漾夢工廠2 明星「挑戰自我」 看節目也要買到手軟', description: '明星極致藝能挑戰秀《花漾夢工廠2》近日在中國山東衛視熱播，相較於第一季，加盟的6位重量級大咖鐘麗緹、小甜甜...', date: '十二月 20, 2016', link: 'news-article.html' },
      // { photo: 'imgs/photo/news-photo-04.jpg', title: 'Viscovery获“2016最具发展潜力”奖，人工智能+视频广告成明年新热点', description: 'Viscovery以其深度学习影音辨识核心技术与明基智能合作，在2017年3月5-9号的德国Euroshop...', date: '十二月 20, 2016', link: 'news-article.html' },
      // { photo: 'imgs/photo/news-photo-05.jpg', title: '花漾夢工廠2 明星「挑戰自我」 看節目也要買到手軟', description: '明星極致藝能挑戰秀《花漾夢工廠2》近日在中國山東衛視熱播，相較於第一季，加盟的6位重量級大咖鐘麗緹、小甜甜...', date: '十二月 20, 2016', link: 'news-article.html' }
    ]
  }
}

export default function saerchData(
  state = defaultState,
  action
) {
  switch (action.type) {
    case types.YEARS:
      return { ...state, yearList:action.response }

    case types.NEWS:
      let response_data = state.newsData.response_data
      response_data = response_data.concat(action.response_data)
      response_data = _.uniqBy(response_data, 'id')
      return { ...state, newsData: { total_count: action.total_count, response_data } }

    case types.CLEAR_NEWS:
      return { ...state, newsData: { total_count: 0, response_data: [] } }

    case types.SET_SEARCH_YEAR:
      return { ...state, searchYear: action.yaer }

    case types.SET_KEYWORD:
      return { ...state, keyword: action.keyword }

    default:
      return state
  }
}
