let message = require('./message')
require('whatwg-fetch')

module.exports = (url, options) => {
  if (!options) options = {}

  // Include credentials.
  options.credentials = 'include'

  // Grab the headers
  let headers = options.headers
  if (!headers) headers = options.headers = {}

  // Set Accept and Content-Type
  headers['Accept'] = headers['Content-Type'] = 'application/json'

  // Stringify the body if necessary
  if (typeof options.body !== 'string') {
    options.body = JSON.stringify(options.body)
  }

  message('info', 'Working…')

  // TODO: Send message on error. Catch network failures.
  return fetch(url, options).then((res) => {
    if (res.status < 200 || res.status >= 300) {
      throw new Error(res.statusText)
    }
    return res.json()
  }).then((data) => {
    if (data && data.message) message('success', data.message)
    return data
  })
}
