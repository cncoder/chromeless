const React = require('react');
import {path} from 'ramda';
import request from 'superagent';
import {getRandomDef, getDefById, getUserById} from '../../utils/utils';
import {Link} from 'react-router';
import {getAuthenticated} from '../../stores/AppStateStore';
import AppStateStore from '../../stores/AppStateStore';
import {InlineTex} from 'react-tex';
const p = (a) => console.log(JSON.stringify(a, null, 2));

class Valsi extends React.Component {
  constructor() {
    super();
    this.state = {
      valsi: null,
      finti: null
    };
  }
  componentWillMount() {
    this.getNewDef();
  }
  getFinti() {
    const self = this;
    if (path([
      'valsi', 'finti'
    ], self.state)) {
      getUserById(self.state.valsi.finti, function(err, pilno) {
        if (err) {
          console.error('could not get a finti from database:', err);
          return;
        }
        self.setState({finti: pilno});
      })
    }
  }
  getNewDef(flag) {
    const self = this;
    getDefById(self.props.params.id, function(err, valsi) {
      if (err) {
        console.error('could not get a valsi from database:', err);
        return;
      }
      self.setState({valsi: valsi});
    });
  }
  render() {
    const self = this;

    let valsi_obj = self.state.valsi || null;
    p(self.state.valsi);
    let valsi = valsi_obj
      ? valsi_obj.valsi
      : null;
    let terbri_good = null;
    if (valsi_obj && valsi_obj.terbri) {
      terbri_good = valsi_obj.terbri.map(function(o) {
        console.log(11111, o.sluji);
        if (o.idx === 0 && o.sluji)
          return `\$\$${ (o.sluji || '').replace(/ /g, '\~')}\$\$ `;
        if (!o.nirna)
          return;
        return `${o.nirna} (${o.klesi}) \$\$${ (o.sluji || '').replace(/ /g, '\~')}\$\$ `;
      }).join(" ").trim();
    }
    const user = AppStateStore.getUser();
    const user_id = path(['_id'], user);
    let finti = null;
    if (!this.state.finti) {
      this.getFinti();
    } else {
      finti = this.state.finti;
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
            <hr/> {!finti
              ? null
              : <p key={`finti`}>Created by&nbsp;
                <Link key={`pilno-${finti._id}`} to={`/pilno/${finti._id}`}>{finti.local.username}</Link>
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
    );
  }
}

module.exports = Valsi;
