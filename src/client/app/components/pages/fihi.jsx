const React = require('react');
import {Link} from 'react-router';

class Fihi extends React.Component {
  render() {
    return (
      <div className="header-content no-center">
        <div className="header-content-inner">
          <div className="Profile-container">
            <h1>Welcome!</h1>
            <p>Here are some links for you:</p>
            <ul className="list-group row">
              <li className="list-group-item col-xs-4" key={`/listall`}>
                <Link to={`/listall`}>All definitions</Link>
              </li>
              <li className="list-group-item col-xs-4" key={`/listuers`}>
                <Link to={`/pilno`}>All users</Link>
              </li>
              <li className="list-group-item col-xs-4" key={`/finti`}>
                <Link to={`/finti`}>Add a new word</Link>
              </li>
              <li className="list-group-item col-xs-4" key={`/jbangu`}>
                <Link to={`/jbangu`}>Add a language</Link>
              </li>
              <li className="list-group-item col-xs-4" key={`/login`}>
                <Link to={`/login`}>Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Fihi;
