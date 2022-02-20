import * as types from 'constants/actionTypes'
import { processingStart, processingEnd, randomRocessId } from 'actions/processing'
import config, { PROCESS_GLOBAL, PROCESS_ALL } from 'constants/config'

// Years
export const getYears = ({
  callback=null, processLevel=PROCESS_GLOBAL, processId=randomRocessId()
}={}) => {
  return {
    type: types.API_ASYNC,
    option: {
      fullUrl      : `${config.api}api/feeds/years`,
      method       : 'GET',
      contentType  : 'form',
      body         : {}
    },
    callback,
    // processingStart: processingStart(processLevel, processId),
    // processingEnd  : processingEnd(processLevel, processId),
    success        : getYearsResponse
  }
}

const getYearsResponse = (response) => {
  return {
    type    : types.YEARS,
    response: response.response_data
  }
}



// News
export const searchNews = ({
  callback=null, processLevel=PROCESS_GLOBAL, processId=randomRocessId(),
  year='', keyword='', offset=0, lang=0
}={}) => {
  return {
    type: types.API_ASYNC,
    option: {
      fullUrl      : `${config.api}api/feeds/?lang=${lang}${keyword === '' ? '' : '&keyword='+keyword}&offset=${offset}&activated=1&limit=30${year === '' ? '' : '&year='+year}`,
      method       : 'GET',
      contentType  : 'form'
    },
    callback,
    processingStart: processingStart(processLevel, processId),
    processingEnd  : processingEnd(processLevel, processId),
    success        : searchNewsResponse
  }
}

const searchNewsResponse = (response) => {
  return {
    type         : types.NEWS,
    response_data: response.response_data,
    total_count  : response.total_count
  }
}

export const clearNews = () => {
  return {
    type: types.CLEAR_NEWS
  }
}

export const setSearchYear = (yaer) => {
  return {
    type: types.SET_SEARCH_YEAR,
    yaer
  }
}

export const setKeyword = (keyword) => {
  return {
    type: types.SET_KEYWORD,
    keyword
  }
}
