const React = require('react')
import request from 'superagent'
import {sisku_satci} from '../../utils/utils'
import {Link} from 'react-router'
import AddOptionButton from '../add_option_button.jsx'
import {getAuthenticated} from '../../stores/AppStateStore'
import AppStateStore from '../../stores/AppStateStore'
import TorduSmuvelcki from '../tordu_smuvelcki.jsx'
const p = (a) => console.log(JSON.stringify(a, null, 2))

class Sisku extends React.Component {
  constructor() {
    super()
    this.state = {
      vlamei: []
    }
  }
  componentWillMount() {
    const self = this
    sisku_satci(self.props.location.query, function(err, vlamei) {
      if (vlamei) {
        self.setState({vlamei: vlamei})
      }
    })
  }
  componentDidMount() {
    document.title = "Search ..."
  }
  render() {
    const self = this
    const allvlamei = this.state.vlamei
    return (
      <div className="header-content">
        <div className="header-content-inner">
          <div>
            <h1>Search ...</h1>
            <hr/>
            <ul className="list-group-horizontal row">
              {allvlamei.map(i => {
                return (
                  <li className="list-group-item col-xs-4" key={`/jorne/${i._id}`}>
                    <TorduSmuvelcki valsi_props={i}/>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Sisku
