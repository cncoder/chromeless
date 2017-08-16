const React = require('react');
import UserTable from '../usertable.jsx';
import UserDefault from '../userdefault.jsx';
import UserDefs from '../userdefs.jsx';
import {getUserById, getDefsFromUserId} from '../../utils/utils';
import {path} from 'ramda';

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {pilno: null, userDefs: null};
  }
  componentWillMount() {
    this.getUser();
  }
  getUser(flag) {
    const self = this;
    if (path(['params','id'],this.props)) {
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
  }
  render() {
    let content;
    const self = this;
    if (this.state.pilno) {
      content = <UserTable user={self.state.pilno}/>;
    } else {
      content = <UserDefault/>;
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
}

module.exports = Profile;
