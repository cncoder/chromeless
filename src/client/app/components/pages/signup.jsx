const React = require('react')
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

class Signup extends BaseComponent {
  constructor() {
    super()
    this.state = {username: '', email: '', password: '', passwordConfirm: '', flashVisible: false, flashMessage: ''}
    this._bind('handleSubmit', 'handleChange')
  }
  handleChange(e) {
    switch (e.target.id) {
      case 'username':
        this.setState({
          username: e.target.value.substr(0, 140)
        })
        break
      case 'email':
        this.setState({
          email: e.target.value
        })
        break
      case 'password':
        this.setState({
          password: e.target.value.substr(0, 140)
        })
        break
      case 'passwordConfirm':
        this.setState({
          passwordConfirm: e.target.value.substr(0, 140)
        })
        break
      default:
        //do nothing
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    if (!this._formValidated())
      return; //if not validated, don't submit form
    const self = this
    const userdata = JSON.stringify({cmene: this.state.username, email: this.state.email})
    request.post('/api/signup').send({username: userdata, password: this.state.password}).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      //console.log(JSON.stringify(res.message))
      if (err) {
        if (err.status === 401 || err.status === 400) {
          console.warn('username not available')
          self.flashMessage('username or email is not available. Choose another one.')
        } else {
          console.error('there was an error submitting form')
        }
        console.error('there was an error submitting form')
      } else if (res.body.user) {
        setUser(res.body.user)
        setAuthenticated(true)
        browserHistory.push('/profile')
      } else if (res.body.message) {
        //console.log(JSON.stringify(res.body.message))
        self.flashMessage(res.body.message)
      } else {
        console.warn('response from signup post did not include the expected user: ', res.body)
      }
    })
  }
  flashMessage(msg) {
    this.setState({flashVisible: true, flashMessage: msg})
    const self = this
    setTimeout(function() {
      self.setState({flashVisible: false, flashMessage: ''})
    }, 3000)
  }
  _formValidated() {
    const username = this.state.username
    const password = this.state.password
    const passwordConfirm = this.state.passwordConfirm
    if (username.length < 1)
      return false
    if (password.length < 1)
      return false
    if (password !== passwordConfirm)
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
          <div className="Signup-container">
            <h1>Sign Up:</h1>
            <p style={{
              marginBottom: 0
            }}>Sign in with your favorite social profile</p>
            <a href="/auth/twitter">
              <i style={iconStyle} className="fa fa-twitter-square" aria-hidden="true"></i>
            </a>
            <a href="/auth/facebook">
              <i style={iconStyle} className="fa fa-facebook-square" aria-hidden="true"></i>
            </a>
            <a href="/auth/google">
              <i style={iconStyle} className="fa fa-google-plus-square" aria-hidden="true"></i>
            </a>
            <hr/>
            <p style={{
              marginBottom: 30
            }}>Or create a new account here</p>
            <FlashMessage visible={this.state.flashVisible} message={this.state.flashMessage} type="error"/>
            <form className="form-horizontal" onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className="col-sm-2" htmlFor="exampleInputEmail1">Username</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="username" value={this.state.username} placeholder="Username"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2" htmlFor="exampleInputEmail1e">Email</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="email" value={this.state.email} placeholder="Email"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2" htmlFor="exampleInputPassword1">Password</label>
                <div className="col-sm-10">
                  <input type="password" className="form-control" id="password" value={this.state.password} placeholder="Password"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2" htmlFor="exampleInputPassword1">Confirm</label>
                <div className="col-sm-10">
                  <input type="password" className="form-control" id="passwordConfirm" value={this.state.passwordConfirm} placeholder="Password Confirm"/>
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

module.exports = Signup
