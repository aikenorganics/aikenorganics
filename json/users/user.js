'use strict'

module.exports = (set, user) => {
  set(user,
    'id',
    'canDeliver',
    'email',
    'name',
    'last',
    'first',
    'phone',
    'is_admin',
    'image_updated_at',
    'image_ext',
    'member_until',
    'stripe_id',
    'card_brand',
    'card_last4',
    'street',
    'city',
    'state',
    'zip',
    'address',
    'has_order',
    'mediumImage'
  )
}