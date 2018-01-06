const React = require('react')
import UserTable from '../usertable.jsx'
import UserDefault from '../userdefault.jsx'
import UserDefs from '../userdefs.jsx'
import {Link} from 'react-router'
import {getMyDefs} from '../../utils/utils'
import request from 'superagent'
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
      showTable: false,
      vlamei: [],
      user: {}
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
    getMyDefs(function(err, vlamei) {
      if (!err) {
        self.setState({vlamei: vlamei.vlamei, user: vlamei.finti})
        document.title = `${self.state.user.cmene} - la almavlaste`
      }
    })
  }

  componentDidMount() {
  }

  render() {
    let content
    let buttonText
    const self = this
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
            <UserDefs text="My definitions:" userDefs={self.state.vlamei}/>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Mi
