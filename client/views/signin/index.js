import React from 'react'
import Link from '../link'
import Errors from '../errors'
import {navigate, signin} from '../../actions'

export default ({busy, errors}) => {
  let email = null
  let password = null

  const submit = (event) => {
    event.preventDefault()
    signin({
      email: email.value,
      password: password.value
    }).then(() => {
      navigate('/products')
    }).catch(() => {})
  }

  return <main className='container'>
    <div className='row'>
      <form onSubmit={submit} className='col-md-6 offset-md-3'>
        <h3>Sign In</h3>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input type='text' id='email' className='form-control' required autoFocus
            placeholder='you@example.com' ref={(input) => { email = input }} />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' className='form-control' required
            ref={(input) => { password = input }} />
        </div>
        <Errors errors={errors} />
        <div className='text-xs-right'>
          <Link href='/signin/forgot'>Forgot Password</Link>
          {' '}
          <button className='btn btn-primary' disabled={busy}>
            Sign In
          </button>
        </div>
      </form>
    </div>
  </main>
}
