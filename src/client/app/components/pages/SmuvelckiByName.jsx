const React = require('react')
import request from 'superagent'
import {getRandomDef, getDefByName, getUserById} from '../../utils/utils'
import {Link} from 'react-router'
import {getAuthenticated} from '../../stores/AppStateStore'
import AppStateStore from '../../stores/AppStateStore'
import TorduSmuvelcki from '../tordu_smuvelcki.jsx'
const p = (a) => console.log(JSON.stringify(a, null, 2))

//show all definitions of a given word in ALL !!! languages
class SmuvelckiByName extends React.Component {
  constructor() {
    super()
    this.state = {
      valsi: null
    }
  }
  componentWillMount() {
    this.getNewDef()
  }
  getNewDef(flag) {
    const self = this
    getDefByName(self.props.params.valsi, function(err, valsi) {
      if (err) {
        console.error('could not get a valsi from database:', err)
        return
      }
      self.setState({valsi: valsi})
    })
  }
  render() {
    const valsi = this.state.valsi
    return (
      <div className="header-content">
        <div className="header-content-inner">
          {!valsi
            ? null
            : <ul className="list-group row">
              {valsi.map(i => {
                return (
                  <div key={`/jorne2/${i._id}`}>
                    <li className="list-group-item col-xs-12" key={`/jorne/${i._id}`}>
                      <div className="formal-group">
                        <TorduSmuvelcki valsi_props={i}/>
                      </div>
                    </li>
                  </div>
                )
              })}
            </ul>}
        </div>
      </div>
    )
  }
}

module.exports = SmuvelckiByName
