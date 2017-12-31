const React = require('react')
import {path} from 'ramda'
import request from 'superagent'
import {getAllUsers} from '../../utils/utils'
import {Link} from 'react-router'
import AddOptionButton from '../add_option_button.jsx'
import {getAuthenticated} from '../../stores/AppStateStore'
import AppStateStore from '../../stores/AppStateStore'

class ListUsers extends React.Component {
  constructor() {
    super()
    this.state = {
      plimei: []
    }
  }
  componentWillMount() {
    const self = this
    getAllUsers((err, plimei)=> {
      self.setState({plimei})
    })
  }
  componentDidMount() {
    document.title = `All users - la almavlaste`
  }
  handleClick({target}) {
    const option_id = target.id
    const disabled = target.disabled
    if (disabled)
      return
    if (option_id !== 'plus') {
      return
    }
    const self = this
    //this.setState({loading: true})
    const user = AppStateStore.getUser()
    request.post(`/api/valsi/${this.state.valsi._id}`).send({
      option_id,
      user: path(['_id'], user)
    }).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end((err, {body}) => {
      if (err)
        return
      console.error('could not post vote to server:', err)
      self.setState({valsi: body, voted: true, loading: false})
    })
  }
  handleAddNewOption(text) {
    if (!getAuthenticated()) {
      document.getElementById('openLoginPrompt').click()
      return
    }
    if (text.length < 1) {
      document.getElementById('openBlankFieldsPrompt').click()
      return
    }
    const option_id = "new"
    const option_text = text
    const self = this
    request.post(`/api/valsi/${this.state.valsi._id}`).send({option_id, option_text}).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end((err, res) => {
      if (err)
        return
      console.error('could not post vote to server:', err)
    })
  }
  render() {
    const self = this
    const allvlamei = this.state.plimei
    return (
      <div className="header-content">
        <div className="header-content-inner">
          <div>
            <button style={{
              display: 'none'
            }} id="openBlankFieldsPrompt" data-toggle="modal" data-target="#blankFieldsPrompt">
              Invisible Blank Fields Prompt
            </button>
            <button style={{
              display: 'none'
            }} id="openLoginPrompt" data-toggle="modal" data-target="#loginPrompt">
              Invisible Launch Login Prompt
            </button>
            <h1>All users</h1>
            <hr/> {allvlamei.map(({_id, cmene, login_type}) => {
              return (
                <div key={`/pilno/${_id}`}>
                  <Link to={`/pilno/${_id}`}>{cmene}
                    ({login_type})</Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ListUsers
