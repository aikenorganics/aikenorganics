import busy from './busy'
import cart from './cart'
import errors from './errors'
import grower from './grower'
import growers from './growers'
import location from './location'
import locations from './locations'
import market from './market'
import product from './product'
import products from './products'
import user from './user'
import users from './users'
import {combineReducers} from 'redux'

const pass = (state = null) => state

export default combineReducers({
  busy,
  canEdit: pass,
  cart,
  categories: pass,
  category_id: pass,
  currentUser: pass,
  emails: pass,
  errors,
  grower,
  growers,
  location,
  locations,
  market,
  more: pass,
  page: pass,
  path: pass,
  product,
  products,
  search: pass,
  url: pass,
  user,
  users
})
