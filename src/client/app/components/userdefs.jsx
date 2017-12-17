const React = require('react')
import AppStateStore from '../stores/AppStateStore'
import {Link} from 'react-router'

class UserDefs extends React.Component {
  render() {
    const userDefs = this.props.userDefs || []
    const defstitle = this.props.text || 'Your Defs:'
    return (
      <div>
        <hr/>
        <h2>{defstitle}</h2>
        <ul className="list-group row">
          {userDefs.map(i => {
            return (
              <li className="list-group-item col-xs-4" key={`/jorne/${i._id}`}>
                <Link key={i._id} to={"/valsi/" + i._id}>{i.valsi}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

module.exports = UserDefs
