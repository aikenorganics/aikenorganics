'use strict'

const Event = require('../../db/event')
const Product = require('../../db/product')
const test = require('../test')

// Index

test('GET /products is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/products').send()
  response.assert(200)
})

test('GET /products is a 200 as a non-admin', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/products').send()
  response.assert(200)
})

test('GET /products is a 200 as an authorized user', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/products').send()
  response.assert(200)
})

test('GET /products is a 200 signed out', function *(t) {
  const response = yield t.client.get('/products').send()
  response.assert(200)
})

test('GET /products?categoryId=:id is a 200', function *(t) {
  const response = yield t.client.get('/products?categoryId=1').send()
  response.assert(200)
})

test('GET /products?search=query is a 200 logged in', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/products?search=peach').send()
  response.assert(200)
})

test('GET /products?search=query is a 200 logged out', function *(t) {
  const response = yield t.client.get('/products?search=peach').send()
  response.assert(200)
})

test('GET /products?search=foo%20bar is a 200', function *(t) {
  const response = yield t.client.get('/products?search=ice%20cream').send()
  response.assert(200)
})

// Show

test('GET /products/:id is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/products/1').send()
  response.assert(200)
})

test('GET /products/:id is a 200 as a non-admin', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/products/1').send()
  response.assert(200)
})

test('GET /products/:id is a 200 as an authorized user', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/products/1').send()
  response.assert(200)
})

test('GET /products/:id is a 200 signed out', function *(t) {
  const response = yield t.client.get('/products/1').send()
  response.assert(200)
})

// Edit

test('GET /products/edit is a 401 signed out', function *(t) {
  const response = yield t.client.get('/products/1/edit').send()
  response.assert(401)
})

test('GET /products/edit is a 401 as a non-admin', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/products/1/edit').send()
  response.assert(401)
})

test('GET /products/edit is a 200 as an authorized user', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/products/1/edit').send()
  response.assert(200)
})

test('GET /products/edit is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/products/1/edit').send()
  response.assert(200)
})

// Update

test('POST /products/:id is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/products/1').send('name=Peaches')
  response.assert(200)
})

test('POST /products/:id is a 200 as an authorized user', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.post('/products/1').send('name=Peaches')
  response.assert(200)
})

test('POST /products/:id is a 401 as a non-admin', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/products/1').send('name=Peaches')
  response.assert(401)
})

test('POST /products/:id is a 422 for invalid data', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/products/1').send({
    name: '',
    cost: 'asdf',
    supply: -23,
    categoryId: 1
  })
  response.assert(422)
})

test('POST /products/:id accepts JSON', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .post('/products/1')
    .set('accept', 'application/json')
    .send({supply: 20})
  response.assert(200).assert('content-type', /application\/json/)
})

test('admins can update featured', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/products/1').send({featured: true})
  response.assert(200)
  const product = yield Product.find(1)
  t.is(product.featured, true)
})

test('non-admins cannot update featured', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.post('/products/1').send({featured: true})
  response.assert(200)
  const product = yield Product.find(1)
  t.is(product.featured, false)
})

test('updating creates an event', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/products/1').send({featured: true})
  response.assert(200)
  const event = yield Event.where({productId: 1}).find()
  t.deepEqual(event.meta, {featured: true})
  t.is(event.userId, 1)
  t.is(event.action, 'update')
  t.is(event.growerId, null)
  t.is(event.productId, 1)
})

// Image

test('POST /products/:id/image is a 401 as a non-admin', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/products/1').send()
  response.assert(401)
})

test('GET /products has no inactive products', function *(t) {
  const response = yield t.client.get('/products').send()
  response.assert(200)
  t.ok(!/\/products\/6/.test(response.body), 'should not see inactive growers')
  t.ok(!/\/products\/7/.test(response.body), 'should not see inactive growers')
})

test('POST /products/:id deactivates products', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.post('/products/1').send({active: false})
  response.assert(200)
  const product = yield Product.find(1)
  t.equal(product.active, false)
})

test('POST /products/:id activates products', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/products/7').send({active: true})
  response.assert(200)
  const product = yield Product.find(7)
  t.equal(product.active, true)
})
