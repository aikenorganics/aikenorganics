var test = require('../test')
var models = require('../../models')

test('GET /orders/current is a 200', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent
    .get('/orders/current')
    .expect(200)
    .end(t.end)
  })
})

test('POST /orders/:id/cancel is a 302', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent
    .post('/orders/2/cancel')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.Order.findOne({
        where: {id: 2},
        transaction: t.transaction
      }).then(function (order) {
        t.ok(order == null, 'the order was deleted')
        t.end()
      })
    })
  })
})

test('POST /orders/:id is a 302', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent
    .post('/orders/2')
    .field('location_id', 2)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.Order.findOne({
        where: {id: 2},
        transaction: t.transaction
      }).then(function (order) {
        t.is(order.location_id, 2)
        t.end()
      })
    })
  })
})

test('Cannot cancel someone else\'s order', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent
    .post('/orders/1/cancel')
    .expect(401)
    .end(t.end)
  })
})

test('Cannout update someone else\'s order', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent
    .post('/orders/1')
    .field('location_id', 2)
    .expect(401)
    .end(t.end)
  })
})
