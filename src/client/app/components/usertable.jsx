var React = require('react');
//import AppStateStore from '../stores/AppStateStore';
import _ from 'lodash';

class UserTable extends React.Component {
  render() {
    var user = this.props.user;
    return (
      <table className="table">
        <tbody>
          <tr>
            <td rowSpan="2">Local</td>
            <td>username:</td>
            <td>{_.get(user, 'local.username', '---')}</td>
          </tr>
          <tr>
            <td>password:</td>
            <td>{_.get(user, 'local.password', '---')}</td>
          </tr>
          <tr>
            <td rowSpan="2">Facebook</td>
            <td>ID:</td>
            <td>{_.get(user, 'facebook.id', '---')}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{_.get(user, 'facebook.displayName', '---')}</td>
          </tr>
          <tr>
            <td rowSpan="2">Twitter</td>
            <td>ID:</td>
            <td>{_.get(user, 'twitter.id', '---')}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{_.get(user, 'twitter.displayName', '---')}</td>
          </tr>
          <tr>
            <td rowSpan="2">Google</td>
            <td>ID:</td>
            <td>{_.get(user, 'google.id', '---')}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{_.get(user, 'google.displayName', '---')}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

module.exports = UserTable;
