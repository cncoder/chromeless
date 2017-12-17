const React = require('react');
import {Link} from 'react-router';
import {InlineTex} from 'react-tex';

class Valsi extends React.Component {
  render() {
    const self = this;
    let i = this.props.valsi_props || null
    let terbri_good
    if (i && i.terbri) {
      terbri_good = i.terbri.map(function(o) {
        if (o.idx === 0 && o.sluji)
          return `\$\$${ (o.sluji || '').replace(/ /g, '\~')}\$\$ `
        if (!o.nirna)
          return
        return `${o.nirna} (${o.klesi.map(j => j.klesi).join(", ")}) \$\$${ (o.sluji || '').replace(/ /g, '\~')}\$\$ `
      }).join(" ").trim()
    }
    return (
      <div>
        <h1>
          <Link to={`/valsi/${i._id}`}>{i.valsi}</Link>
        </h1>
        <div className="formal-group">
          <p key={`terbri`}>
            {!terbri_good
              ? null
              : <InlineTex texContent={terbri_good}/>}
          </p>
        </div>
        <hr/> {(!i.finti || !i.finti._id)
          ? null
          : <p key={`finti`}>
            <Link to={`/pilno/${i._id}`}>Created by&nbsp;{i.finti.cmene}</Link>
          </p>}
      </div>
    )
  }
}

module.exports = Valsi;
