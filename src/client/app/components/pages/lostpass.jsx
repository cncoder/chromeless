const React = require('react')
import {Link} from 'react-router'
import request from 'superagent'
import {browserHistory} from 'react-router'
import {setUser, setAuthenticated} from '../../actions/AppStateActionCreators'
import FlashMessage from '../flashmessage.jsx'

const iconStyle = {
  fontSize: 52,
  margin: 10
}
class BaseComponent extends React.Component {
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this))
  }
}

class LostPass extends BaseComponent {
  constructor() {
    super()
    this.state = {
      userdatum: '',
      message: `Currently you can't choose a new password. Instead we can only generate a new password for you ourselves. Passwords for your account can be sent not more often than once every 24 hours.`,
      backtologin: false
    }
    this._bind('handleSubmit', 'handleChange', 'flashMessage', '_formValidated')
  }
  componentDidMount() {
    document.title = "Send a new password"
  }
  handleChange(e) {
    if (e.target.id === 'email') {
      this.setState({userdatum: e.target.value})
    }
  }
  flashMessage(msg, persistent) {
    this.setState({flashVisible: true, flashMessage: msg})
    const self = this
    if (persistent)
      return
    setTimeout(function() {
      self.setState({flashVisible: false, flashMessage: ''})
    }, 3000)
  }
  handleSubmit(e) {
    e.preventDefault()
    const self = this
    request.post('/api/restorepass').send({userdatum: this.state.userdatum}).set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      if (err) {
        if (err.status === 401 || err.status === 400) {
          console.warn('incorrect username or email')
          self.flashMessage('incorrect username or email')
        } else {
          console.error('there was an error submitting form')
        }
      } else if (res.body.sentemail) {
        self.flashMessage(`Once the nickname or email is in the database and more than 24 hours passed since the previous request (if any) you will get a message with a new password in your e-mail inbox.`,true)
      } else {
        console.log('unknown error')
      }
    })
  }
  _formValidated() {
    const userdatum = this.state.userdatum
    if (userdatum.length < 1)
      return false
    return true
  }
  render() {
    let buttonClass = ''
    if (!this._formValidated()) {
      buttonClass = 'disabled'
    }
    return (
      <div className="header-content">
        <div className="header-content-inner">
          <div className="Login-container">
            <h1>Send a new password:</h1>
            <hr/>
            <FlashMessage visible={this.state.flashVisible} message={this.state.flashMessage} type="error"/>
            <form className="form-horizontal" onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <div className="form-group">
                <p style={{
                  textAlign: 'justify'
                }}>{this.state.message}</p>
                {!this.state.backtologin
                  ? null
                  : <div>
                    <Link to="/login">Back to login</Link>
                  </div>}
                <div className="col-sm-12">
                  <input type="text" className="form-control" id="email" value={this.state.userdatum} placeholder="nickname or email"/>
                </div>
              </div>
              <button type="submit" className={"btn btn-default " + buttonClass}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = LostPass
