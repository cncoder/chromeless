const React = require('react');
import request from 'superagent';
import {getRandomDef, getDefByName, getUserById} from '../../utils/utils';
import {Link} from 'react-router';
import {getAuthenticated} from '../../stores/AppStateStore';
import AppStateStore from '../../stores/AppStateStore';

//show all definitions of a given word in ALL !!! languages
class SmuvelckiByName extends React.Component {
  constructor() {
    super();
    this.state = {
      valsi: null
    };
  }
  componentWillMount() {
    this.getNewDef();
  }
  getNewDef(flag) {
    const self = this;
    getDefByName(self.props.params.valsi, function(err, valsi) {
      if (err) {
        console.error('could not get a valsi from database:', err);
        return;
      }
      self.setState({valsi: valsi});
    });
  }
  render() {
    const valsi = this.state.valsi;
    const self = this;
    return (
      <div className="header-content">
        <div className="header-content-inner">
          <h1>{self.props.params.valsi}</h1>
          {!valsi
            ? null
            : <ul className="list-group row">
              {valsi.map(i => {
                return (
                  <div key={`/jorne2/${i._id}`}>
                    <li className="list-group-item col-xs-12" key={`/jorne/${i._id}`}>
                      <div className="formal-group">
                        <div key={`terbri_${i._id}`}>
                          {i.terbri.map(function(o) {
                            if (o.idx === 0 && o.sluji)
                              return `${o.sluji} `;
                            if (!o.nirna)
                              return;
                            return `${o.nirna} (${o.klesi}) ${o.sluji} `;
                          }).join(" ").trim()}
                        </div>
                        <div>{i.finti
                            ? i.finti.cmene || ''
                            : null}</div>
                      </div>
                    </li>
                  </div>
                );
              })}
            </ul>}
        </div>
      </div>
    );
  }
}

module.exports = SmuvelckiByName;
