const React = require('react')
import UserTable from '../usertable.jsx'
import UserDefault from '../userdefault.jsx'
import UserDefs from '../userdefs.jsx'
import {Link} from 'react-router'
import {getAuthenticated, getUser, getUserDefs} from '../../stores/AppStateStore'
import request from 'superagent'
import {browserHistory} from 'react-router'
const p = (a, root, indent) => console.log(JSON.stringify(a, root || null, indent || 2));

class BaseComponent extends React.Component {
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this))
  }
}

class Mi extends BaseComponent {
  constructor() {
    super()
    this._bind('_flipView')
    this.state = {
      showTable: false
    }
  }
  _flipView() {
    const showTable = this.state.showTable
    this.setState({
      showTable: !showTable
    })
  }
  componentWillMount() {
    const self = this
    request.post('mi').set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      //todo handle bad response
      if (err || !res) {
        browserHistory.push('/login/')
        //document.getElementById('openLoginPrompt').click()
        return
      }
      const user = res.body
      document.title = `${user.cmene || 'User'} - profile`
      self.setState({user})
    })
    // const user = getUser()
  }
  render() {
    let content
    let buttonText
    const self = this
    const userDefs = getUserDefs() || []
    if (this.state.showTable) {
      content = <UserTable user={self.state.user}/>
      buttonText = 'less detailed view'
    } else {
      content = <UserDefault/>
      buttonText = 'more detailed view'
    }
    return (
      <div className="header-content no-center">
        <div className="header-content-inner">
          <div className="Profile-container">
            <h1>Security</h1>
            <Link to={`/lostpass`}>Change password</Link>
            <h1>Personal info</h1>
            <button style={{
              marginBottom: 10
            }} onClick={this._flipView} className="btn btn-primary">{buttonText}</button>
            {content}
            <UserDefs text="My definitions:" userDefs={userDefs}/>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Mi
