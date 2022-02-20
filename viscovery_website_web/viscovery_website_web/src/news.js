import 'babel-polyfill'
import 'fetch-polyfill'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import reducer from 'reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/rootSaga'
import { DEVELOPMENT } from 'constants/config'

import FilterBar from 'components/news/FilterBar'
import SearchContent from 'components/news/SearchContent'
import 'gsap';

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
if (process.env.NODE_ENV === DEVELOPMENT) {
  middlewares.push(createLogger())
}

const store = compose(applyMiddleware(...middlewares))(createStore)(reducer)
sagaMiddleware.run(rootSaga)


ReactDOM.render(
  <Provider store={store}>
    <div>
      <FilterBar />

      {/* <section className="search-result-bar">
        <div className="search-result-bar__content">
          <h6 className="search-result-bar__content__title font-h2 color-main">”發展潛力“</h6>
          <p className="search-result-bar__content__txt font-h6-sm{ color-dark">找到 <span className="color-main">4</span> 篇文章</p>
        </div>
      </section> */}

      <SearchContent />
    </div>
  </Provider>
  , document.getElementById('searchContainer')
)


// Title進場
TweenMax.to('.zoom-in-bg', 0.7, {opacity: 1, ease: Power4.easeOut, delay: 0.5, force3D:true});
TweenMax.to('.zoom-in', 1, {scale: 1, ease: Power4.easeOut, delay: 1, force3D:true});
