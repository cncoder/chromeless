const React = require('react')
import {Link} from 'react-router'
import request from 'superagent'
import {getMe} from '../../utils/utils'
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
      message: `Currently you can't choose a new password. Instead we can only generate a new password for you ourselves. Passwords for your account can be sent not more often than once every 24 hours.`,
      backtologin: false,
      pilno: ''
    }
    this._bind('handleSubmit', 'handleChange', 'flashMessage', '_formValidated')
  }
  componentWillMount() {
    const self=this
    getMe((err, pilno)=> {
      if (!err) {
        self.setState({pilno: pilno.cmene})
      }
    })
  }
  componentDidMount() {
    document.title = "Send a new password"
  }
  handleChange(e) {
    if (e.target.id === 'email') {
      this.setState({pilno: e.target.value})
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
    request.post('/api/restorepass').send({pilno: this.state.pilno}).set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
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
    const pilno = this.state.pilno
    if (pilno.length < 1)
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
                <label className="col-sm-4 control-label" htmlFor="exampleInputEmail1">Email or username</label>
                <div className="col-sm-6">
                  <input type="text" className="form-control" id="email" value={this.state.pilno}/>
                </div>
                <div className="col-sm-2">
                  <button type="submit" className={"btn btn-default " + buttonClass}>Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = LostPass
