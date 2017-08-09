var React = require('react');
import _ from 'lodash';
import request from 'superagent';
import {getRandomDef, getDefById, getUserById} from '../../utils/utils';
import {Link} from 'react-router';
import Chart from '../chart.jsx';
import AddOptionButton from '../add_option_button.jsx';
import {getAuthenticated} from '../../stores/AppStateStore';
import AppStateStore from '../../stores/AppStateStore';
import {InlineTex} from 'react-tex';

var Valsi = React.createClass({
  getInitialState: function() {
    return ({
      valsi: null,
      voted: false,
      addButtonActive: false,
      loading: false,
      twobuttons: [
        { //shbe a part of stae
          "vote": "plus"
        }, {
          "vote": "minus"
        }
      ]
    });
  },
  componentWillMount() {
    this.getNewDef();
  },
  getFinti: function() {
    const self = this;
    if (_.hasIn(self.state, 'valsi.finti')) {
      getUserById(self.state.valsi.finti, function(err, pilno) {
        if (err) {
          console.error('could not get a finti from database:', err);
          return;
        }
        self.setState({finti: pilno});
      })
    }
  },
  getNewDef: function(flag) {
    var self = this;
    this.setState({loading: true});
    getDefById(self.props.params.id, function(err, valsi) {
      if (err) {
        console.error('could not get a valsi from database:', err);
        return;
      }
      self.setState({valsi: valsi, voted: false, addButtonActive: false, loading: false});
    });
  },
  // handleClick: function(e){
  //     var user = AppStateStore.getUser();
  //     var option_id = e.target.id;
  //     var self = this;
  //     this.setState({loading: true});
  //     //console.log(this.state.valsi._id,{option_id:option_id,user:_.get(user,'_id')});
  //     request
  //         .post('/api/valsi/'+this.state.valsi._id)
  //         .send({option_id:option_id,user:_.get(user,'_id')})
  //         .set('Accept', 'application/json')
  //         .set('Content-Type', 'application/x-www-form-urlencoded')
  //         .end(function(err, res){
  //             if (err) return console.error('could not post vote to server:', err);
  //             self.setState({
  //                 valsi: res.body,
  //                 voted: true,
  //                 loading: false
  //             });
  //         });
  // },
  handleClick: function(e) {
    var option_id = e.target.id;
    var disabled = e.target.disabled;
    if (disabled)
      return;
    if (option_id !== 'plus') {
      console.log('already voted so no action');
      return;
    }
    var self = this;
    this.setState({loading: true});
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
    this.setState({loading: true});
    request.post('/api/valsi/' + this.state.valsi._id).send({option_id: option_id, option_text: option_text}).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      if (err)
        return
      console.error('could not post vote to server:', err);
      self.setState({valsi: res.body, voted: true, loading: false});
    });
  },
  handleAddOptionActivate: function() {
    this.setState({addButtonActive: true});
  },
  render: function() {
    var spinner;
    var valsi;
    var addOptionButtonMarkup;
    var chart;
    var noCenterClass = "";
    if (_.hasIn(this.state, 'valsi')) {
      valsi = this.state.valsi;
      //console.log(JSON.stringify(valsi));
    }
    // if(_.hasIn(this.state,'valsi.adza')){
    //     adza = this.state.valsi.adza;
    //     if(options.length < 9) {
    //         addOptionButtonMarkup = <AddOptionButton handleAddNewOption={this.handleAddNewOption}
    //                                                  active = {this.state.addButtonActive}
    //                                                  clickHandle = {this.handleAddOptionActivate}
    //                                                      buttonStyle={buttonStyle}/>
    //     }
    // }
    if (this.state.voted) {
      chart = <Chart valsi={this.state.valsi}/>;
      //adza = [];
      addOptionButtonMarkup = null;
      noCenterClass = 'no-center';
    }
    if (this.state.loading) {
      chart = null;
      spinner = <img src="/img/spinner.gif"></img>;
      //adza = [];
      valsi = {};
      addOptionButtonMarkup = null;
      //console.log(this.state.twobuttons);
      this.state.twobuttons[0] = {
        "vote": "---",
        disabled: true
      };
    } else {
      this.state.twobuttons[0] = {
        "vote": "loaded",
        disabled: false
      };
    }
    var self = this;
    var user = AppStateStore.getUser();
    const user_id = _.get(user, '_id');
    if (this.state.valsi && this.state.valsi.upvotes && this.state.valsi.upvotes.filter(i => i.user === user_id).length > 0) { //array
      console.log('already voted ' + user_id, this.state.valsi.upvotes);
      //so plus=>upvoted
      this.state.twobuttons[0] = {
        "vote": "did upvote",
        disabled: true
      };
    }
    let finti;
    if (!this.state.finti) {
      this.getFinti();
    } else {
      finti = this.state.finti;
    }
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
            <h1>{valsi.valsi}</h1>
            <hr/> {spinner}
            {!finti
              ? null
              : <p key={`finti`}>Created by&nbsp;
                <Link key={`pilno-${finti._id}`} to={`/pilno/${finti._id}`}>{finti.local.username}</Link>
              </p>}
            {!valsi.terbri
              ? null
              : <div className="formal-group">
                <p key={`terbri`}>
                  <InlineTex texContent=
                  {valsi.terbri.map(function(o) {
                    if (o.idx === 0 && o.sluji)
                      return `\$\$${(o.sluji||'').replace(/ /g,'\~')}\$\$ `;
                    if (!o.nirna)
                      return;
                    return `${o.nirna} (${o.klesi}) \$\$${(o.sluji||'').replace(/ /g,'\~')}\$\$ `;
                    // <Tex texContent={'pi'}/>
                  }).join(" ").trim()}
                  />
                </p>
              </div>}
            {self.state.twobuttons.map(function(item) {
              return <a href='#' id={item.vote} disabled={item.disabled} onClick={self.handleClick} className="btn btn-primary btn-xl page-scroll" key={item.vote}>{item.vote}</a>
            })}
            {addOptionButtonMarkup}

          </div>
        </div>
      </div>
    );
  }
});
module.exports = Valsi;
