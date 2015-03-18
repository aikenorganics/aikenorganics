var express = require('express')
var find = require('../mid/find')
var models = require('../models')
var router = module.exports = express.Router()

router.use(function (req, res, next) {
  if (req.user) return next()
  res.status(401).render('401')
})

router.param('order_id', find(models.Order))

// Current
router.get('/current', function (req, res) {
  models.Order.findOne({
    where: {
      status: 'open',
      user_id: req.user.id
    },
    include: [{
      model: models.ProductOrder,
      as: 'productOrders',
      include: [{model: models.Product, as: 'product'}]
    }]
  }).then(function (order) {
    res.render('orders/current', {order: order})
  })
})

// Cancel
router.post('/:order_id/cancel', function (req, res) {
  if (!process.env.OPEN) return res.status(401).render('401')
  if (!req.order) return res.status(404).render('404')

  // You can only cancel your own order.
  if (req.user.id !== req.order.user_id) {
    return res.status(401).render('401')
  }

  req.transaction(function (t) {
    return req.order.destroy({transaction: t}).then(function () {
      res.flash('success', 'Order cancelled.')
      res.redirect('/products')
    })
  })
})
