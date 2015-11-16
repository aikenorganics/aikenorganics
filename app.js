'use strict'

// Vendor
let ozymandias = require('ozymandias')
let session = require('cookie-session')

// The App!
let app = module.exports = ozymandias()
app.locals = require('./helpers')

// Middleware
app.use(session({
  signed: app.get('env') === 'production',
  name: 'aikenorganics',
  secret: process.env.SECRET,
  maxAge: 1000 * 60 * 60 * 24 * 7
}))
app.use(require('./mid/market'))
app.use(require('./mid/cart'))
app.use(require('./mid/user'))
app.use(require('./mid/flash'))
app.use(require('./mid/url'))

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/cart', require('./routes/cart'))
app.use('/admin', require('./routes/admin'))
app.use('/orders', require('./routes/orders'))
app.use('/growers', require('./routes/growers'))
app.use('/products', require('./routes/products'))
app.use('/settings', require('./routes/settings'))

// Home
app.get('/', function (req, res) {
  res.render('index')
})

// Learn
app.get('/learn', function (req, res) {
  res.render('learn/index')
})

// 404
app.get('*', function (req, res) {
  res.status(404).render('404')
})

// 500
app.use(function (e, req, res, next) {
  console.log(e.stack)
  res.status(500).render('500')
})
