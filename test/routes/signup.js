'use strict'

const test = require('../test')

test('signup page is a 200', async ({assert, client}) => {
  const response = await client.get('/signup').send()
  response.assert(200)
})

test('POST /signup handles mixed case emails', async ({assert, client}) => {
  const response = await client.post('/signup').send({
    email: 'AdMiN@eXaMpLe.CoM',
    password: 'password'
  })
  response.assert(422).assert('content-type', /json/)
})

test('POST /signup handles first, last, and phone', async ({assert, client}) => {
  const response = await client.post('/signup').send({
    first: 'Finn',
    last: 'Mertens',
    phone: '803.512.3421',
    email: 'finn@ooo.net',
    password: 'password'
  })
  response.assert(200)
})

test('Full signup flow', async ({assert, client}) => {
  const signup = await client.post('/signup').send({
    first: 'Jake',
    last: 'The Dog',
    phone: '803.123.4321',
    email: 'jake@ooo.net',
    password: 'sandwich'
  })
  signup.assert(200)

  const signout = await client.delete('/session').send()
  signout.assert(200)

  const incorrectPassword = await client.post('/session').send({
    email: 'jake@ooo.net',
    password: 'sandwiches'
  })
  incorrectPassword.assert(422)

  const incorrectEmail = await client.post('/session').send({
    email: 'jake@oooo.net',
    password: 'sandwich'
  })
  incorrectEmail.assert(422)

  const correct = await client.post('/session').send({
    email: 'jake@ooo.net',
    password: 'sandwich'
  })
  correct.assert(200)
})
