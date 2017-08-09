var React = require('react');
import _ from 'lodash';
import request from 'superagent';
import {getAllUsers} from '../../utils/utils';
import {Link} from 'react-router';
import Chart from '../chart.jsx';
import AddOptionButton from '../add_option_button.jsx';
import {getAuthenticated} from '../../stores/AppStateStore';
import AppStateStore from '../../stores/AppStateStore';

var ListUsers = React.createClass({
  getInitialState: function() {
    return ({plimei: []});
  },
  componentWillMount() {
    var self = this;
    getAllUsers(function(err, plimei) {
      self.setState({plimei: plimei});
    });
  },
  componentDidMount() {
    document.title = `All users - la almavlaste`;
  },
  handleClick: function(e) {
    var option_id = e.target.id;
    var disabled = e.target.disabled;
    if (disabled)
      return;
    if (option_id !== 'plus') {
      return;
    }
    var self = this;
    //this.setState({loading: true});
    var user = AppStateStore.getUser();
    request.post('/api/valsi/' + this.state.valsi._id).send({
      option_id: option_id,
      user: _.get(user, '_id')
    }).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      if (err)
        return
      console.error('could not post vote to server:', err);
      self.setState({valsi: res.body, voted: true, loading: false});
    });
  },
  handleAddNewOption(text) {
    if (!getAuthenticated()) {
      document.getElementById('openLoginPrompt').click();
      return;
    }
    if (text.length < 1) {
      document.getElementById('openBlankFieldsPrompt').click();
      return;
    }
    var option_id = "new";
    var option_text = text;
    var self = this;
    //this.setState({loading: true});
    request.post('/api/valsi/' + this.state.valsi._id).send({option_id: option_id, option_text: option_text}).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      if (err)
        return
      console.error('could not post vote to server:', err);
      //self.setState({valsi: res.body, voted: true, loading: false});
    });
  },
  handleAddOptionActivate: function() {
    //this.setState({addButtonActive: true});
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
    let allvlamei = this.state.plimei;
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
            <h1>All users</h1>
            <hr/> {spinner}
            {allvlamei.map(i => {
              return <div key={`/pilno/${i._id}`}><Link to={`/pilno/${i._id}`}>{i.cmene} ({i.login_type})</Link></div>;
            })}
          </div>
        </div>
      </div>
    );
  }
});
module.exports = ListUsers;
