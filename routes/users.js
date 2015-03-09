var express = require('express');
var User = require('../models').User;
var find = require('../mid/find');
var upload = require('../mid/image-upload');
var adminOnly = require('../mid/admin-only');
var router = module.exports = express.Router();

router.use(adminOnly);
router.param('user_id', find('_user', User));

router.get('/', function(req, res) {
  User.findAll({order: [['email', 'ASC']]}).then(function(users) {
    res.render('users/index', {users: users});
  });
});

router.get('/:user_id/edit', function(req, res) {
  res.render('users/edit', {showAdmin: true});
});

router.post('/:user_id', function(req, res) {
  req._user.update(req.body, {
    fields: ['first', 'last', 'phone', 'is_admin']
  }).then(function() {
    res.flash('success', 'Saved');
    res.redirect('/users');
  });
});

router.post('/:user_id/image', upload('_user'));
