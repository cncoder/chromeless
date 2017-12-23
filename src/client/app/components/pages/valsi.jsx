const React = require('react')
import {path} from 'ramda'
import request from 'superagent'
import {getRandomDef, getDefById, getUserById} from '../../utils/utils'
import {Link} from 'react-router'
import {getAuthenticated} from '../../stores/AppStateStore'
import AppStateStore from '../../stores/AppStateStore'
import {Creatable} from 'react-select-plus'
import {InlineTex} from 'react-tex'
const p = (a, root, indent) => console.log(JSON.stringify(a, root || null, indent || 2));

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
      // p(valsi)
      self.setState({valsi: valsi})
      self.setState({finti: valsi["finti"]})
      self.setState({tcitymei: valsi.tcita.map(i=>{return {value: i.tcita.tcita,label:i.tcita.tcita}})})
    })
  }
  componentDidMount(){
    document.title = this.state.valsi? `${this.state.valsi.valsi} - la almavlaste`:`la almavlaste`
  }
  render() {
    const self = this
    let valsi_obj = self.state.valsi || null
    let valsi = valsi_obj
      ? valsi_obj.valsi
      : null
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
            <hr/> {(!self.state.finti)
              ? null
              : <p key={`finti`}>Created by&nbsp;
                <Link to={`/pilno/${self.state.finti._id}`}>{self.state.finti.cmene}</Link>
              </p>}
            <div className="formal-group" key={`terbri`}>
                {!terbri_good
                  ? null
                  : <InlineTex texContent={terbri_good}/>}
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Tags</label>
              <div className="col-sm-10">
                <Creatable name="form-control" multi value={self.state.tcitymei} options={self.state.tcitymei} disabled={true}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Valsi
