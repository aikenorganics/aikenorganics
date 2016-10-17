'use strict'

const db = require('../db')
const app = require('../app')
const http = require('http')
const tape = require('tape')
const request = require('supertest')
const {Builder, By} = require('selenium-webdriver')
const driver = new Builder().forBrowser('chrome').build()

// Export a function with the tape API.
exports = module.exports = (name, callback) => {
  tape(name, (t) => {
    // Have we visited any pages?
    let visited = false

    // Get a page.
    t.visit = (path) => {
      visited = true
      return driver.get(`http://open.localhost:4444${path}`)
    }

    // Find an element with a CSS selector.
    t.$ = (selector) => driver.findElement(By.css(selector))

    // Does the element exist?
    t.present = (selector) => driver.isElementPresent(By.css(selector))

    // Wait for something to happen.
    t.wait = (predicate) => driver.wait(predicate)

    // Get the current path.
    t.getPath = () => driver.executeScript('return window.location.pathname')

    // Set up transactions.
    const transaction = db.transaction()
    db.query = transaction.query.bind(transaction)

    // Set a fake hostname
    app.hostname = 'open.localhost'
    t.hostname = (hostname) => { app.hostname = hostname }

    // Request without the app requirement.
    t.request = () => request(app)

    // Convenient agent reference.
    t.agent = request.agent(http.createServer(app.callback()))

    // Sign in, with error handling.
    t.signIn = (email) => new Promise((resolve, reject) => {
      t.agent
      .post('/session')
      .send({email, password: 'password'})
      .expect(200)
      .end((error) => error ? reject(error) : resolve())
    }).catch(t.end)

    // Rollback the transaction before ending the test.
    const end = t.end.bind(t)
    t.end = (...args) => {
      Promise.all([
        transaction.rollback(),
        visited ? driver.manage().deleteAllCookies() : Promise.resolve()
      ])
      .then(() => end(...args))
      .catch(() => end(...args))
    }

    callback(t)
  })
}

exports.driver = driver
