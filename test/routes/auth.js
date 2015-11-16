'use strict'

let db = require('../../db')
let test = require('../test')

test('signup page is a 200', function (t) {
  t.request()
  .get('/auth/signup')
  .expect(200)
  .end(t.end)
})

test('Can sign in with password', function (t) {
  t.request()
  .post('/auth/signin')
  .send('email=admin@example.com')
  .send('password=password')
  .expect(302)
  .end(t.end)
})

test('GET /auth/forgot is a 200', function (t) {
  t.request()
  .get('/auth/forgot')
  .expect(200)
  .end(t.end)
})

test('POST /auth/forgot is a 404 for missing emails', function (t) {
  t.request()
  .post('/auth/forgot')
  .send('email=does@not.exist')
  .expect(404)
  .end(t.end)
})

test('POST /auth/forgot is a 302 for existing emails', function (t) {
  t.request()
  .post('/auth/forgot')
  .send('email=admin@example.com')
  .expect(302)
  .end(t.end)
})

test('GET /auth/reset is a 404 for missing tokens', function (t) {
  t.request()
  .get('/auth/reset/doesnotexist')
  .expect(404)
  .end(t.end)
})

test('GET /auth/reset is a 200 for valid tokens', function (t) {
  let agent = t.request()
  agent.post('/auth/forgot')
  .send('email=admin@example.com')
  .expect(302)
  .end(function (e) {
    if (e) return t.end(e)
    db.transaction(function () {
      db.Token.where({user_id: 1}).find().then(function (token) {
        agent.get(`/auth/reset/${token.id}`)
        .expect(200)
        .end(t.end)
      })
    }).catch(t.end)
  })
})

test('POST /auth/reset is a 302 for valid tokens', function (t) {
  let agent = t.request()
  agent.post('/auth/forgot')
  .send('email=admin@example.com')
  .expect(302)
  .end(function (e) {
    if (e) return t.end(e)
    db.transaction(function () {
      db.Token.where({user_id: 1}).find().then(function (token) {
        agent.post(`/auth/reset/${token.id}`)
        .send('password=password')
        .expect(302)
        .end(t.end)
      })
    }).catch(t.end)
  })
})

test('POST /auth/reset is a 404 for missing tokens', function (t) {
  t.request()
  .post('/auth/reset')
  .send('token=does not exist')
  .send('password=password')
  .expect(404)
  .end(t.end)
})

test('POST /auth/reset enforces password length of 8', function (t) {
  let agent = t.request()
  agent.post('/auth/forgot')
  .send('email=admin@example.com')
  .expect(302)
  .end(function (e) {
    if (e) return t.end(e)
    db.transaction(function () {
      db.Token.where({user_id: 1}).find().then(function (token) {
        agent.post(`/auth/reset/${token.id}`)
        .send('password=secret')
        .expect(422)
        .end(t.end)
      })
    }).catch(t.end)
  })
})

test('POST /auth/signin handles mixed case emails', function (t) {
  t.request()
  .post('/auth/signin')
  .send('email=AdMiN@eXaMpLe.CoM')
  .send('password=password')
  .expect(302)
  .end(t.end)
})

test('POST /auth/forgot handles mixed case emails', function (t) {
  t.request()
  .post('/auth/forgot')
  .send('email=AdMiN@eXaMpLe.CoM')
  .expect(302)
  .end(t.end)
})

test('POST /auth/signup handles mixed case emails', function (t) {
  t.request()
  .post('/auth/signup')
  .send('email=AdMiN@eXaMpLe.CoM')
  .send('password=password')
  .expect(422)
  .end(t.end)
})

test('POST /auth/signup handles first, last, and phone', function (t) {
  t.request()
  .post('/auth/signup')
  .send('first=Finn')
  .send('last=Mertens')
  .send('phone=803.512.3421')
  .send('email=finn@ooo.net')
  .send('password=password')
  .expect(302)
  .end(t.end)
})

test('Full signup flow', function (t) {
  let agent = t.request()

  agent
  .post('/auth/signup')
  .send('first=Jake')
  .send('last=The Dog')
  .send('phone=803.123.4321')
  .send('email=jake@ooo.net')
  .send('password=sandwich')
  .expect(302)
  .end(function (e) {
    if (e) return t.end(e)

    agent
    .get('/auth/signout')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)

      agent
      .post('/auth/signin')
      .send('email=jake@ooo.net')
      .send('password=sandwiches')
      .expect(422)
      .end(function (e) {
        if (e) return t.end(e)

        agent
        .post('/auth/signin')
        .send('email=jake@oooo.net')
        .send('password=sandwich')
        .expect(404)
        .end(function (e) {
          if (e) return t.end(e)

          agent
          .post('/auth/signin')
          .send('email=jake@ooo.net')
          .send('password=sandwich')
          .expect(302)
          .end(t.end)
        })
      })
    })
  })
})
