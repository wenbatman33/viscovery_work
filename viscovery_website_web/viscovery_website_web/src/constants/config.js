// Fetch Error
export const FetchException     = 'Failed Fetch'
// Processing
export const PROCESS_GLOBAL     = 'global'
export const PROCESS_ALL        = 'all'
// NODE_ENV
export const DEVELOPMENT        = 'development'
export const PRODUCTION         = 'production'
// router basename
export const BASE_PAGE_BASENAME = '/'

const config = {
  FetchException,
  PROCESS_GLOBAL, PROCESS_ALL,
  DEVELOPMENT, PRODUCTION,
  BASE_PAGE_BASENAME,
  mode: PRODUCTION,
  api : `${location.protocol}//${location.hostname}:8080/`
}

if (process.env.NODE_ENV === DEVELOPMENT) {
  config.mode = DEVELOPMENT
  config.api = 'http://viscovery.co:8080/'
}

export default config;
