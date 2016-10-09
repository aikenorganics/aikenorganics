import 'es6-promise/auto'
import React from 'react'
import store from './store'
import Routes from './routes'
import {render} from 'react-dom'
import Bugsnag from 'bugsnag-js'
import assign from 'object-assign'
import {navigate} from './actions'

// Bugs!
assign(Bugsnag, store.getState().bugsnag)

// The element to render components into.
const root = document.getElementById('root')

// Update the DOM
const update = () => render(<Routes {...store.getState()} />, root)

// Render when the store is updated.
store.subscribe(update)

// Navigate on popstate.
let hashChanged
window.addEventListener('popstate', () => {
  hashChanged = false
  setTimeout(() => {
    if (!hashChanged) navigate(window.location.href, {push: false})
  }, 0)
})

window.addEventListener('hashchange', () => {
  hashChanged = true
})

// Kick the tires
if (root) update()
