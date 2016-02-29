import {UPDATE_USER} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_USER:
      if (!state || state.id !== action.id) return state
      return Object.assign({}, state, action.values)

    default:
      return state
  }
}
