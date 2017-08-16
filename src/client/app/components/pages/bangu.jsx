const React = require('react');
import {getBanguById} from '../../utils/utils';
import {path} from 'ramda';

class Bangu extends React.Component {
  constructor() {
    super();
    this.state = {
      bangu: null
    };
  }
  componentWillMount() {
    this.getBangu();
  }
  getBangu(flag) {
    const self = this;
    if (path(['params','id'],this.props)) {
      getBanguById(self.props.params.id, function(err, bangu) {
        if (err) {
          console.error('could not get a bangu from database:', err);
          return;
        }
        self.setState({bangu: bangu});
      })
    }
  }
  render() {
    let content;
    const self = this;
    if (this.state.bangu) {
      console.log(this.state.bangu);
      content = <p>{self.state.bangu.krasi_cmene}</p>;
    } else {
      content = null;
    }
    return (
      <div className="header-content no-center">
        <div className="header-content-inner">
          <div className="Profile-container">
            <h1>Language:</h1>
            {content}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Bangu;
