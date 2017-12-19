const React = require('react')
import {path} from 'ramda'
import request from 'superagent'
import {getRandomDef, getDefById, getUserById} from '../../utils/utils'
import {Link} from 'react-router'
import {getAuthenticated} from '../../stores/AppStateStore'
import AppStateStore from '../../stores/AppStateStore'
import {InlineTex} from 'react-tex'

class Valsi extends React.Component {
  constructor() {
    super()
    this.state = {
      valsi: null,
      finti_name: null,
      finti: null
    }
  }
  componentWillMount() {
    const self = this
    getDefById(self.props.params.id, function(err, valsi) {
      if (err) {
        console.error('could not get a valsi from database:', err)
        return
      }
      self.setState({valsi: valsi})
      const user = valsi["finti"]
      self.setState({
        finti_name: path([
          'local', 'username'
        ], user) || path([
          'facebook', 'displayName'
        ], user) || path([
          'twitter', 'displayName'
        ], user) || path([
          'google', 'displayName'
        ], user)
      })
      self.setState({finti: user})
    })
  }
  render() {
    const self = this
    let valsi_obj = self.state.valsi || null
    let valsi = valsi_obj
      ? valsi_obj.valsi
      : null
    document.title = valsi? `${valsi} - la almavlaste`:`la almavlaste`
    let terbri_good = null
    if (valsi_obj && valsi_obj.terbri) {
      terbri_good = valsi_obj.terbri.map(function(o) {
        if (o.idx === 0 && o.sluji)
          return `\$\$${ (o.sluji || '').replace(/ /g, '\~')}\$\$ `
        if (!o.nirna)
          return
        return `${o.nirna} (${o.klesi}) \$\$${ (o.sluji || '').replace(/ /g, '\~')}\$\$ `
      }).join(" ").trim()
    }
    const finti = self.state.finti
    const finti_name = self.state.finti_name
    return (
      <div className="header-content">
        <div className="header-content-inner">
          <div>
            <button style={{
              display: 'none'
            }} id="openBlankFieldsPrompt" data-toggle="modal" data-target="#blankFieldsPrompt">
              Invisible Blank Fields Prompt
            </button>
            <button style={{
              display: 'none'
            }} id="openLoginPrompt" data-toggle="modal" data-target="#loginPrompt">
              Invisible Launch Login Prompt
            </button>
            <h1>{valsi}</h1>
            <hr/> {(!finti_name || !finti)
              ? null
              : <p key={`finti`}>Created by&nbsp;
                <Link to={`/pilno/${finti._id}`}>{finti_name}</Link>
              </p>}
            <div className="formal-group">
              <p key={`terbri`}>
                {!terbri_good
                  ? null
                  : <InlineTex texContent={terbri_good}/>}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Valsi
