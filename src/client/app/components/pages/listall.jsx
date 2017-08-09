var React = require('react');
import _ from 'lodash';
import request from 'superagent';
import {getAllDefs, getDefById} from '../../utils/utils';
import {Link} from 'react-router';
import Chart from '../chart.jsx';
import AddOptionButton from '../add_option_button.jsx';
import {getAuthenticated} from '../../stores/AppStateStore';
import AppStateStore from '../../stores/AppStateStore';

var ListAll = React.createClass({
  getInitialState: function() {
    return ({vlamei: []});
  },
  componentWillMount() {
    var self = this;
    getAllDefs(function(err, vlamei) {
      self.setState({vlamei: vlamei});
    });
    //this.getAllDefs();
  },
  componentDidMount() {
    document.title = "All definitions";
  },
  render: function() {
    var spinner;
    var addOptionButtonMarkup;
    var chart;
    var noCenterClass = "";
    // if (_.hasIn(this.state, 'valsi.word')) {
    //   word = this.state.valsi.word;
    // }
    // if(_.hasIn(this.state,'valsi.adza')){
    //     adza = this.state.valsi.adza;
    //     if(options.length < 9) {
    //         addOptionButtonMarkup = <AddOptionButton handleAddNewOption={this.handleAddNewOption}
    //                                                  active = {this.state.addButtonActive}
    //                                                  clickHandle = {this.handleAddOptionActivate}
    //                                                      buttonStyle={buttonStyle}/>
    //     }
    // }
    // if (this.state.voted) {
    //   chart = <Chart valsi={this.state.valsi}/>;
    //   //adza = [];
    //   addOptionButtonMarkup = null;
    //   noCenterClass = 'no-center';
    // }
    // if (this.state.loading) {
    //   chart = null;
    //   spinner = <img src="/img/spinner.gif"></img>;
    //   //adza = [];
    //   addOptionButtonMarkup = null;
    //   this.state.twobuttons[0] = {
    //     "vote": "---",
    //     disabled: true
    //   };
    // } else {
    //   this.state.twobuttons[0] = {
    //     "vote": "loaded",
    //     disabled: false
    //   };
    // }
    var self = this;
    var user = AppStateStore.getUser();
    const user_id = _.get(user, '_id');
    let allvlamei = this.state.vlamei;
    // if (this.state.valsi && this.state.valsi.upvotes && this.state.valsi.upvotes.filter(i => i.user === user_id).length > 0) { //array
    //   //so plus=>upvoted
    //   this.state.twobuttons[0] = {
    //     "vote": "did upvote",
    //     disabled: true
    //   };
    // }
    return (
      <div className={"header-content " + noCenterClass}>
        <div className="header-content-inner">
          <div>
            <h1>All words</h1>
            <hr/> {spinner}
            <ul className="list-group-horizontal row">
              {allvlamei.map(i => {
                return <li className="list-group-item col-xs-4" key={`/jorne/${i._id}`}><Link to={`/valsi/${i._id}`}>{i.valsi}</Link></li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = ListAll;
