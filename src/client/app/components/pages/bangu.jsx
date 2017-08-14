var React = require('react');
import {getBanguById} from '../../utils/utils';
import _ from 'lodash';

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
    var self = this;
    if (_.hasIn(this.props, 'params.id')) {
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
    var content;
    var self = this;
    if (this.state.bangu) {
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
