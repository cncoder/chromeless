var React = require('react');
import _ from 'lodash';
import request from 'superagent';
import {getAllUsers} from '../../utils/utils';
import {Link} from 'react-router';
import AddOptionButton from '../add_option_button.jsx';
import {getAuthenticated} from '../../stores/AppStateStore';
import AppStateStore from '../../stores/AppStateStore';

class ListUsers extends React.Component {
  constructor() {
    super();
    this.state = {
      plimei: []
    };
  }
  componentWillMount() {
    var self = this;
    getAllUsers(function(err, plimei) {
      self.setState({plimei: plimei});
    });
  }
  componentDidMount() {
    document.title = `All users - la almavlaste`;
  }
  handleClick(e) {
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
  }
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
    request.post('/api/valsi/' + this.state.valsi._id).send({option_id: option_id, option_text: option_text}).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      if (err)
        return
      console.error('could not post vote to server:', err);
    });
  }
  render() {
    const self = this;
    const allvlamei = this.state.plimei;
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
            <h1>All users</h1>
            <hr/> {allvlamei.map(i => {
              return (
                <div key={`/pilno/${i._id}`}>
                  <Link to={`/pilno/${i._id}`}>{i.cmene}
                    ({i.login_type})</Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ListUsers;
