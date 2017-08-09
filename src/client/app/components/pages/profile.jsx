var React = require('react');
import UserTable from '../usertable.jsx';
import UserDefault from '../userdefault.jsx';
import UserDefs from '../userdefs.jsx';
import AppStateStore from '../../stores/AppStateStore';

var Profile = React.createClass({
  getInitialState: function() {
    return ({showTable: false});
  },
  _flipView: function() {
    var showTable = this.state.showTable;
    this.setState({
      showTable: !showTable
    });
  },
  componentWillMount() {
    const user = AppStateStore.getUser();
    this.setState({user: user});
  },
  componentDidMount() {
    document.title = `${this.state.user.cmene || 'User'} - profile`;
  },
  render: function() {
    var content;
    var buttonText;
    const self = this;
    var userDefs = AppStateStore.getUserDefs() || [];
    if (this.state.showTable) {
      content = <UserTable user={self.state.user}/>;
      buttonText = 'less detailed view';
    } else {
      content = <UserDefault/>;
      buttonText = 'more detailed view';

    }
    return (
      <div className="header-content no-center">
        <div className="header-content-inner">
          <div className="Profile-container">
            <h1>My Profile:</h1>
            <button style={{
              marginBottom: 10
            }} onClick={this._flipView} className="btn btn-primary">{buttonText}</button>
            {content}
            <UserDefs text="Your Defs:" userDefs={userDefs}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Profile;
