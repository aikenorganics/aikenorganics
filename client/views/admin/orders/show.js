import React from 'react'
import moment from 'moment'
import Link from '../../link'
import Errors from '../../errors'
import Status from './status'
import Form from '../../form'
import Charge from './charge'
import {
  updateOrder,
  createProductOrder,
  updateProductOrder,
  destroyProductOrder
} from '../../../actions'

export default ({errors, locations, order, payments, products, productOrders}) => {
  const {id, locationId, status, user} = order

  const addProduct = (productId) => {
    createProductOrder({
      orderId: id,
      productId,
      quantity: 1
    })
  }

  return <div>
    <div className='pull-right hidden-print'>
      {status !== 'complete'
        ? <button className='btn btn-success'
          onClick={() => updateOrder(id, {status: 'complete'})}>
          Complete
        </button>
        : ''
      } {status !== 'canceled'
        ? <button className='btn btn-danger'
          onClick={() => updateOrder(id, {status: 'canceled'})}>
          Cancel
        </button>
        : ''
      } {status !== 'open'
        ? <button className='btn btn-info'
          onClick={() => updateOrder(id, {status: 'open'})}>
          Reopen
        </button>
        : ''
      }
    </div>
    <h2>
      <Link href={`/admin/orders/${id}`}>Order #{id}</Link>
      <small> <Status order={order} /></small>
    </h2>
    <h3>
      <Link href={`/admin/users/${user.id}/edit`}>{user.name}</Link> <small>
        {user.email}
        <span> - </span>
        {moment(user.memberUntil).isSameOrAfter(new Date())
          ? `Member until ${moment(user.memberUntil).format('MM/DD/YYYY')}`
          : 'Not a Member'
        }
      </small>
    </h3>
    <Errors errors={errors} />
    <table className='table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Cost</th>
          <th>Quantity</th>
          <th>Total</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {productOrders.map(({cost, id, product, quantity, total}) => {
          const update = (values) => {
            updateProductOrder(id, values).catch(() => {})
          }

          return <tr key={id}>
            <td style={{whiteSpace: 'nowrap'}}>
              <Link href={`/products/${product.id}`}>{product.name}</Link> {product.oversold
                ? <span className='label label-danger'>Oversold</span>
                : ''
              }
            </td>
            <td>
              <Form onUpdate={(value) => update({cost: value || 0})}>
                <div className='input-group'>
                  <span className='input-group-addon'>$</span>
                  <input className='form-control' defaultValue={cost || 0} required />
                </div>
              </Form>
            </td>
            <td>
              <Form onUpdate={(value) => update({quantity: value || 0})}>
                <input type='number' className='form-control' defaultValue={quantity || 0} min='1' max={quantity + product.available} required />
              </Form>
            </td>
            <td>${total.toFixed(2)}</td>
            <td>
              <button className='btn btn-danger btn-xs'
                onClick={() => { if (window.confirm('Are you sure?')) destroyProductOrder(id) }}>
                Remove
              </button>
            </td>
          </tr>
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan='3'>
            <select className='form-control' onChange={(event) => addProduct(event.target.value)} value=''>
              <option value=''>Add to Order…</option>
              {products.filter(({id}) => {
                return !productOrders.some(({productId}) => id === productId)
              }).map(({id, name}) => {
                return <option key={id} value={id}>{name}</option>
              })}
            </select>
          </td>
          <td><strong>${productOrders.reduce((sum, {total}) => sum + total, 0).toFixed(2)}</strong></td>
          <td />
        </tr>
      </tfoot>
    </table>
    <div className='form-group'>
      <label>Location</label>
      <select className='form-control' defaultValue={locationId} onChange={(event) => updateOrder(id, {locationId: event.target.value || null})}>
        {user.canDeliver
          ? <option value=''>Deliver to {user.address}</option>
          : ''
        }
        {locations.map(({id, name}) => {
          return <option key={id} value={id}>{name}</option>
        })}
      </select>
    </div>
    <div className='form-group'>
      <label>Notes</label>
      <Form onUpdate={(notes) => updateOrder(id, {notes})}>
        <textarea className='form-control' rows='10' defaultValue={order.notes} />
      </Form>
    </div>
    <h2>Payments</h2>
    <table className='table'>
      <thead>
        <tr>
          <th>Stripe ID</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(({amount, id, stripeId}) => {
          return <tr key={id}>
            <td>
              <a href={`https://dashboard.stripe.com/payments/${stripeId}`} target='_blank'>
                {stripeId}
              </a>
            </td>
            <td>${(amount / 100).toFixed(2)}</td>
          </tr>
        })}
      </tbody>
      <tfoot>
        <tr>
          <td><strong>Total</strong></td>
          <td><strong>${
            (payments.reduce((sum, {amount}) => sum + amount, 0) / 100).toFixed(2)
          }</strong></td>
        </tr>
      </tfoot>
    </table>
    {user.stripeId
      ? <Charge order={order} />
      : ''
    }
  </div>
}
