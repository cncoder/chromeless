var React = require('react');
import _ from 'lodash';
import request from 'superagent';
import {getRandomDef, getDefByName, getUserById} from '../../utils/utils';
import {Link} from 'react-router';
import Chart from '../chart.jsx';
import AddOptionButton from '../add_option_button.jsx';
import {getAuthenticated} from '../../stores/AppStateStore';
import AppStateStore from '../../stores/AppStateStore';

//show all definitions of a given word in ALL !!! languages
var SmuvelckiByName = React.createClass({
  getInitialState: function() {
    return ({valsi: null});
  },
  componentWillMount() {
    this.getNewDef();
  },
  getNewDef: function(flag) {
    var self = this;
    getDefByName(self.props.params.valsi, function(err, valsi) {
      if (err) {
        console.error('could not get a valsi from database:', err);
        return;
      }
      //valsi = valsi[0];
      self.setState({valsi: valsi});
    });
  },
  render: function() {
    var valsi = this.state.valsi;
    var addOptionButtonMarkup;
    var chart;
    var noCenterClass = "";
    var self = this;
    return (
      <div className={"header-content " + noCenterClass}>
        <div className="header-content-inner">
          <h1>{self.props.params.valsi}</h1>
          {!valsi
            ? null
            : <ul className="list-group row">
              {valsi.map(i => {
                return <div key={`/jorne2/${i._id}`}>
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
                      <div>{i.finti?i.finti.cmene||'':null}</div>
                    </div>
                  </li>
                </div>;
              })}
            </ul>}
        </div>
      </div>
    );
  }
});
module.exports = SmuvelckiByName;
