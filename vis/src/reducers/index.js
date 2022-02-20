import { combineReducers } from 'redux'
import sys from './sys'
import processing from './processing'
import searchData from './searchData'

const reducer = combineReducers({
  sys,
  processing,
  searchData
})

export default reducer
