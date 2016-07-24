import assign from 'object-assign'
import {CLEAR_MESSAGE, SET_MESSAGE} from '../actions/index'

export default (state = null, {type, message}) => {
  switch (type) {
    case SET_MESSAGE:
      return message

    case CLEAR_MESSAGE:
      return assign({}, state, {active: false})

    default:
      return state
  }
}
