'use strict'

const db = require('../../../db')
const test = require('../../test')

test('POST /admin/user-growers is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/user-growers')
    .send({userId: 2, growerId: 1})
    .expect(200)
    .end((error) => {
      if (error) return t.end(error)
      db.UserGrower.where({userId: 2, growerId: 1}).find().then((userGrower) => {
        t.ok(userGrower)
        t.end()
      }).catch(t.end)
    })
  })
})

test('DELETE /admin/user-growers/:userGrowerId is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .delete('/admin/user-growers/1')
    .expect(200)
    .end((error) => {
      if (error) return t.end(error)
      db.UserGrower.find(1).then((userGrower) => {
        t.ok(!userGrower)
        t.end()
      }).catch(t.end)
    })
  })
})
