'use strict'

const test = require('../../test')
const Category = require('../../../db/category')

test('new category', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/categories/new')
  await browser.$('#name').sendKeys('Test Category')
  await browser.$('#position').sendKeys('12345')
  await browser.$('#meat').click()
  await browser.$('#meat').submit()
  await browser.wait(browser.present('#message:not(.active)'))
  const category = await Category.where({position: 12345}).find()
  assert.is(category.name, 'Test Category')
  assert.is(category.position, 12345)
  assert.is(category.meat, true)
})

test('edit a category', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/categories/1/edit')
  await browser.$('#name').clear()
  await browser.$('#name').sendKeys('Test Name')
  await browser.$('#position').clear()
  await browser.$('#position').sendKeys('12345')
  await browser.$('#meat').click()
  await browser.$('#meat').submit()
  await browser.wait(browser.present('#message:not(.active)'))
  const category = await Category.find(1)
  assert.is(category.name, 'Test Name')
  assert.is(category.position, 12345)
  assert.is(category.meat, true)
})
