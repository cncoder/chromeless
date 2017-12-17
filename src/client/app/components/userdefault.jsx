const React = require('react')
import AppStateStore from '../stores/AppStateStore'
import {path, pathEq} from 'ramda'

function pathExists(arr, obj){
  return path(arr, obj)!==undefined
}
class UserDefault extends React.Component {
  render() {
    const user = AppStateStore.getUser()
    const name = path(['local','username'], user) || path(['facebook','displayName'], user) || path(['twitter','displayName'], user) || path(['google','displayName'], user)
    let login
    switch (true) {
      case pathExists(['local'], user):
        //display password changing functions
        login = 'logged in locally'
        break
      case pathExists(['facebook'], user):
        login = 'logged in with facebook'
        break
      case pathExists(['twitter'], user):
        login = 'logged in with twitter'
        break
      case pathExists(['google'], user):
        login = 'logged in with google'
        break
      default:
        login = 'did not detect your login..?'
        //default?
    }
    return (
      <ul className="list-group">
        <li className="list-group-item">{name}</li>
        <li className="list-group-item">{login}</li>
      </ul>
    )
  }
}

module.exports = UserDefault
