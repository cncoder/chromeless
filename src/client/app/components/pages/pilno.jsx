var React = require('react');
import UserTable from '../usertable.jsx';
import UserDefault from '../userdefault.jsx';
import UserDefs from '../userdefs.jsx';
import {getUserById, getDefsFromUserId} from '../../utils/utils';
import _ from 'lodash';

var Profile = React.createClass({
  getInitialState: function() {
    return ({pilno: null, userDefs: null});
  },
  // _flipView: function() {
  //   var showTable = this.state.showTable;
  //   this.setState({
  //     showTable: !showTable
  //   });
  // },
  componentWillMount() {
    this.getUser();
  },
  getUser: function(flag) {
    var self = this;
    if (_.hasIn(this.props, 'params.id')) {
      getUserById(self.props.params.id, function(err, user) {
        if (err) {
          console.error('could not get a user from database:', err);
          return;
        }
        self.setState({pilno: user});
        getDefsFromUserId(user._id,function(err,defs){
          if (err)
            return console.error(err);
          self.setState({userDefs: defs});
        });
        document.title = `${user.cmene} - la almavlaste`;
      })
    }
  },
  render: function() {
    var content;
    //var buttonText;
    var self = this;
    if (this.state.pilno) {
      content = <UserTable user={self.state.pilno}/>;
      //buttonText = 'less detailed view';
    } else {
      content = <UserDefault/>;
      //buttonText = 'more detailed view';
    }
    return (
      <div className="header-content no-center">
        <div className="header-content-inner">
          <div className="Profile-container">
            <h1>User's profile:</h1>
            {content}
            <UserDefs text="User's definitions:" userDefs={self.state.userDefs}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Profile;
