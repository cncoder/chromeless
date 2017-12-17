const React = require('react')
import {path} from 'ramda'

class UserTable extends React.Component {
  render() {
    const user = this.props.user
    return (
      <table className="table">
        <tbody>
          <tr>
            <td rowSpan="2">Local</td>
            <td>username:</td>
            <td>{path(['local','username'], user) || '---'}</td>
          </tr>
          <tr>
            <td>password:</td>
            <td>{path(['local','password'], user) || '---'}</td>
          </tr>
          <tr>
            <td rowSpan="2">Facebook</td>
            <td>ID:</td>
            <td>{path(['facebook','id'], user) || '---'}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{path(['facebook','displayName'], user) || '---'}</td>
          </tr>
          <tr>
            <td rowSpan="2">Twitter</td>
            <td>ID:</td>
            <td>{path(['twitter','id'], user) || '---'}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{path(['twitter','displayName'], user) || '---'}</td>
          </tr>
          <tr>
            <td rowSpan="2">Google</td>
            <td>ID:</td>
            <td>{path(['google','id'], user) || '---'}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{path(['google','displayName'], user) || '---'}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

module.exports = UserTable
