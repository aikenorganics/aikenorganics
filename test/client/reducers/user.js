import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_USER} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update user - email', (assert) => {
  const state = freeze({user: {id: 1, email: 'foo@example.com'}})
  const next = reducer(state, {
    type: UPDATE_USER,
    id: 1,
    values: {email: 'bar@example.com'}
  })
  assert.deepEqual(next.user, {id: 1, email: 'bar@example.com'})
  assert.end()
})

test('update user - wrong id', (assert) => {
  const state = freeze({user: {id: 1, email: 'foo@example.com'}})
  const next = reducer(state, {
    type: UPDATE_USER,
    id: 2,
    values: {email: 'bar@example.com'}
  })
  assert.deepEqual(next.user, {id: 1, email: 'foo@example.com'})
  assert.end()
})
