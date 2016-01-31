import React from 'react'

export default ({growers}) => {
  const total = growers.reduce((sum, {total}) => sum + +total, 0)

  return <div>
    <h1>Growers</h1>
    <hr/>
    <table className='table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Active</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {growers.map(({active, id, name, total}) => {
          return <tr key={id}>
            <td><a href={`/admin/growers/${id}`}>{name}</a></td>
            <td>
              {active
                ? <span className='label label-primary'>Active</span>
                : <span className='label label-default'>Inactive</span>
              }
            </td>
            <td>${total || 0}</td>
          </tr>
        })}
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td>${total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  </div>
}