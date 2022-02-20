import * as types from 'constants/actionTypes';



let defaultState = {
  list: [

  ]
}

export default function visualBanner(
  state = defaultState,
  action
) {
  switch (action.type) {
    case types.VISUAL_BANNER_LIST:
      return state

    default:
      return state
  }
}
