var React = require('react');
import {checkAuthenticationAPI} from '../utils/utils';
import AppStateStore from '../stores/AppStateStore.js';
import LoginPrompt from './modal_loginprompt.jsx';
import BlankFieldsPrompt from './modal_blankfieldsprompt.jsx';
import {Link} from 'react-router';

class BaseComponent extends React.Component {
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this));
  }
}

class Application extends BaseComponent {
  constructor() {
    super();
    this._bind('_onAppStateChange');
    this.state = AppStateStore.getAppState();
  }
  componentWillMount() {
    checkAuthenticationAPI();
  }
  componentDidMount() {
    AppStateStore.addChangeListener(this._onAppStateChange);
  }
  componentWillUnmount() {
    AppStateStore.removeChangeListener(this._onAppStateChange);
  }
  _onAppStateChange() {
    var state = AppStateStore.getAppState();
    this.setState(state);
  }
  render() {
    var navbar;
    const logo = <img src="/img/pelnimre1.svg" className="logo"></img>;
    if (this.state.authenticated) {
      navbar = <ul className="nav navbar-nav navbar-right">
        <li>
          <Link to="/pilno">List users</Link>
        </li>
        <li>
          <Link to="/listall">List all</Link>
        </li>
        <li>
          <Link to="/finti">Add yours</Link>
        </li>
        <li>
          <Link to="/profile">My Profile</Link>
        </li>
        <li>
          <a href="/api/logout">Logout</a>
        </li>
      </ul>
    } else {
      navbar = <ul className="nav navbar-nav navbar-right">
        <li>
          <Link to="/create">Add word</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Join Us!</Link>
        </li>
      </ul>;
    }
    return (
      <div className="Layout">
        <div id="mainNav" className="navbar-alma navbar-default-alma">
          <div className="container-fluid-alma container-alma">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link to="/">
                {logo}<span className="navbar-brand page-scroll">almavlaste</span>
              </Link>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              {navbar}
            </div>
          </div>
        </div>
        <div className="header">
          <LoginPrompt/>
          <BlankFieldsPrompt/>
          <div className="header-inner-alma">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Application;
