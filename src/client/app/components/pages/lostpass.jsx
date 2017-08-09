var React = require('react');
import {Link} from 'react-router';
import request from 'superagent';
import {browserHistory} from 'react-router';
import {setUser, setAuthenticated} from '../../actions/AppStateActionCreators';
import FlashMessage from '../flashmessage.jsx';

var iconStyle = {
  fontSize: 52,
  margin: 10
};

var LostPass = React.createClass({
  getInitialState: function() {
    return ({userdatum: '', message: `Currently you can't choose a new password. Instead we can only generate a new password for you ourselves. Passwords for your account can be sent not more often than once every 24 hours.`, backtologin: false});
  },
  componentDidMount() {
    document.title = "Restore password";
  },
  handleChange: function(e) {
    if (e.target.id === 'email')
      this.setState({userdatum: e.target.value});
    }
  ,
  handleSubmit: function(e) {
    e.preventDefault();
    var self = this;
    request.post('/api/restorepass').send({userdatum: this.state.userdatum}).set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      if (err) {
        if (err.status === 401 || err.status === 400) {
          console.warn('incorrect username or email');
          self.flashMessage('incorrect username or email');
        } else {
          console.error('there was an error submitting form');
        }
      } else if (res.body.sentemail) {
        self.setState({message: `Once the nickname or email is in the database and more than 24 hours passed since the previous request (if any) you will get a message with a new password in your e-mail inbox.`, backtologin: true});
        //setUser(res.body.user);
        //setAuthenticated(true);
        //browserHistory.push('/profile');
      } else {
        console.log('unknown error');
      }
    });
  },
  flashMessage: function(msg) {
    this.setState({flashVisible: true, flashMessage: msg});
    var self = this;
    setTimeout(function() {
      self.setState({flashVisible: false, flashMessage: ''});
    }, 3000);
  },
  _formValidated: function() {
    var userdatum = this.state.userdatum;
    if (userdatum.length < 1)
      return false;
    return true;
  },
  render: function() {
    var buttonClass = '';
    if (!this._formValidated()) {
      buttonClass = 'disabled';
    }
    return (
      <div className="header-content">
        <div className="header-content-inner">
          <div className="Login-container">
            <h1>Restore password:</h1>
            <hr/>
            <FlashMessage visible={this.state.flashVisible} message={this.state.flashMessage} type="error"/>
            <form className="form-horizontal" onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <div className="form-group">
                <p style={{
                  marginBottom: 30,
                  textAlign: 'justify'
                }}>{this.state.message}</p>
                {!this.state.backtologin
                  ? null
                  : <div>
                    <Link to="/login">Back to login</Link>
                  </div>}
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="email" value={this.state.userdatum} placeholder="nickname or email"/>
                </div>
              </div>
              <button type="submit" className={"btn btn-default " + buttonClass}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LostPass;
