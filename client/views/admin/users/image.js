import React from 'react'
import {imageUser} from '../../../actions/index'

export default ({busy, user: {id, mediumImage}}) => {
  const upload = ({target}) => {
    imageUser(id, target.files[0]).catch(() => {})
    target.value = ''
  }

  return <div>
    <div className='form-group text-center'>
      <img className='img-rounded' src={mediumImage}/>
    </div>
    <div className='form-group'>
      <input type='file' className='form-control' onChange={upload} disabled={busy}/>
    </div>
  </div>
}
