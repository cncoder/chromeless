const React = require('react');
import {path} from 'ramda';
import request from 'superagent';
import {getRandomDef, getDefById, getUserById} from '../utils/utils';
import {Link} from 'react-router';
import {getAuthenticated} from '../stores/AppStateStore';
import AppStateStore from '../stores/AppStateStore';
import {InlineTex} from 'react-tex';

class Valsi extends React.Component {
  constructor() {
    super();
    this.state = {
      valsi: null,
      finti_name: null,
      finti: null
    };
  }

  render() {
    const self = this;
    let valsi_obj = this.props.valsi_props || null;
    let valsi = valsi_obj
      ? valsi_obj.valsi
      : null;
    let terbri_good = null;
    if (valsi_obj && valsi_obj.terbri) {
      terbri_good = valsi_obj.terbri.map(function(o) {
        if (o.idx === 0 && o.sluji)
          return `\$\$${ (o.sluji || '').replace(/ /g, '\~')}\$\$ `;
        if (!o.nirna)
          return;
        return `${o.nirna} (${o.klesi}) \$\$${ (o.sluji || '').replace(/ /g, '\~')}\$\$ `;
      }).join(" ").trim();
    };
    const finti = valsi_obj.finti;
    const finti_name = valsi_obj.finti_name;
    return (
      <div>
        <h1>{valsi}</h1>
        <hr/> {(!finti_name || !finti)
          ? null
          : <p key={`finti`}>Created by&nbsp;
            <Link to={`/pilno/${finti}`}>{finti_name}</Link>
          </p>}
        <div className="formal-group">
          <p key={`terbri`}>
            {!terbri_good
              ? null
              : <InlineTex texContent={terbri_good}/>}
          </p>
        </div>
      </div>
    );
  }
}

module.exports = Valsi;
