import test from 'tape'
import freeze from 'deep-freeze'
import {
  CREATE_PAYMENT,
  CANCEL_ORDER,
  UPDATE_ORDER
} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

test('update order - location_id', (t) => {
  const state = freeze({order: {id: 1, location_id: 1}})
  const next = reducer(state, {
    type: UPDATE_ORDER,
    id: 1,
    values: {location_id: 2}
  })
  t.deepEqual(next.order, {id: 1, location_id: 2})
  t.end()
})

test('update order - wrong id', (t) => {
  const state = freeze({order: {id: 1, location_id: 1}})
  const next = reducer(state, {
    type: UPDATE_ORDER,
    id: 2,
    values: {location_id: 2}
  })
  t.deepEqual(next.order, {id: 1, location_id: 1})
  t.end()
})

test('update order - remove location', (t) => {
  const state = freeze({order: {id: 1, location_id: 1, location: {}}})
  const next = reducer(state, {
    type: UPDATE_ORDER,
    id: 1,
    values: {location_id: null}
  })
  t.deepEqual(next.order, {id: 1, location_id: null})
  t.end()
})

test('cancel order - already null', (t) => {
  const state = freeze({order: null})
  const next = reducer(state, {
    type: CANCEL_ORDER,
    id: 3
  })
  t.is(next.order, null)
  t.end()
})

test('cancel order', (t) => {
  const state = freeze({order: {id: 3}})
  const next = reducer(state, {
    type: CANCEL_ORDER,
    id: 3
  })
  t.is(next.order, null)
  t.end()
})

test('cancel order - wrong id', (t) => {
  const state = freeze({order: {id: 3}})
  const next = reducer(state, {
    type: CANCEL_ORDER,
    id: 2
  })
  t.deepEqual(next.order, {id: 3})
  t.end()
})

test('create payment', (t) => {
  const state = freeze({order: {id: 4, payments: [{id: 1}]}})
  const next = reducer(state, {
    type: CREATE_PAYMENT,
    id: 4,
    payment: {id: 2}
  })
  t.deepEqual(next.order, {id: 4, payments: [{id: 1}, {id: 2}]})
  t.end()
})
