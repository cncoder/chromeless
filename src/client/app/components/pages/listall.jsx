const React = require('react');
import request from 'superagent';
import {getAllDefs, getDefById} from '../../utils/utils';
import {Link} from 'react-router';
import AddOptionButton from '../add_option_button.jsx';
import {getAuthenticated} from '../../stores/AppStateStore';
import AppStateStore from '../../stores/AppStateStore';

class ListAll extends React.Component {
  constructor() {
    super();
    this.state = {vlamei: []};
  }
  componentWillMount() {
    const self = this;
    getAllDefs(function(err, vlamei) {
      self.setState({vlamei: vlamei});
    });
  }
  componentDidMount() {
    document.title = "All definitions";
  }
  render() {
    const self = this;
    const allvlamei = this.state.vlamei;

    return (
      <div className="header-content">
        <div className="header-content-inner">
          <div>
            <h1>All words</h1>
            <hr/>
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
}

module.exports = ListAll;
