'use strict'

const test = require('../../test')
const Location = require('../../../db/location')

test('new location', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/locations/new')
  await browser.$('#name').sendKeys('Test Location')
  await browser.$('#name').submit()
  await browser.assert('#message:not(.active)')
  assert.ok(await Location.where({name: 'Test Location'}).find())
})

test('edit a location', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/locations/1/edit')
  await browser.$('#name').clear()
  await browser.$('#name').sendKeys('Test Name')
  await browser.$('#name').submit()
  await browser.assert('#message:not(.active)')
  const location = await Location.find(1)
  assert.is(location.name, 'Test Name')
})
