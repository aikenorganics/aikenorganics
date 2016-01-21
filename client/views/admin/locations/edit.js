import React, {Component, PropTypes} from 'react'
import {updateLocation} from '../../../actions'

export default class Edit extends Component {

  static propTypes () {
    return {
      location: PropTypes.array
    }
  }

  constructor (props) {
    super(props)
    const {name} = props.location
    this.state = {name}
  }

  changeName (e) {
    this.setState({name: e.target.value})
  }

  submit (e) {
    e.preventDefault()

    const {name} = this.state
    const {id} = this.props.location

    updateLocation(id, {name}).then(() => {
      window.location = '/admin/locations'
    }).catch(e => {})
  }

  render () {
    const {name} = this.state

    return <div>
      <h1>Edit Location</h1>
      <hr/>
      <form onSubmit={(e) => this.submit(e)}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input autoFocus type='text' id='name' name='name' className='form-control' required value={name} onChange={(e) => this.changeName(e)}/>
        </div>
        <p className='text-right'>
          <button type='submit' className='btn btn-primary'>
            Save
          </button>
        </p>
      </form>
    </div>
  }

}
