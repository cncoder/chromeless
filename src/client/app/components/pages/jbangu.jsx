const React = require('react');
import request from 'superagent';
import {getAuthenticated} from '../../stores/AppStateStore';
import {browserHistory} from 'react-router';
import {Link} from 'react-router';

function findKey(obj, value) {
  return Object.keys(obj).filter(i => obj[i].idx === value)[0];
}

class BaseComponent extends React.Component {
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this));
  }
}

class JBangu extends BaseComponent {
  constructor() {
    super();
    this.state = {
      tcita: [],
      krasi_cmene: '',
      bridi: false,
      info: null,
      Bangu: null
    };
    this._bind('handleSubmit', 'handleChange', '_validateForm');
  }
  componentDidMount() {
    document.title = `Add language`;
  }
  handleChange(e) {
    if (!e.target)
      return;
    if (e.target.id === 'bangu') {
      this.setState({krasi_cmene: e.target.value});
    } else if (e.target.id === 'bridi') {
      this.setState({bridi: e.target.checked});
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    let self = this;
    if (!getAuthenticated()) {
      document.getElementById('openLoginPrompt').click();
      return;
    }
    if (!this._validateForm()) {
      document.getElementById('openBlankFieldsPrompt').click();
      return;
    }
    request.post('api/jmina_lebangu/').send({krasi_cmene: self.state.krasi_cmene, bridi: self.state.bridi}).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      if (res.body.Bangu) {
        self.setState({Bangu: res.body.Bangu});
      }
      if (res.body.message) {
        self.setState({info: res.body.message});
        return;
      }
      if (err || !res.ok) {
        console.error('there was an error submitting form');
      }
      browserHistory.push('/bangu/' + self.state.Bangu._id);
    });
  }
  _validateForm() {
    let validated = true;
    if (this.state.krasi_cmene.length < 1)
      validated = false;
    return validated;
  }
  render() {
    const self = this;
    return (
      <div className="header-content no-center">
        <div className="header-content-inner">
          <div className="Create-container">
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

            <h1 style={{
              marginBottom: 15
            }}>Add a language</h1>
            {!(this.state.info || this.state.Bangu)
              ? null
              : <div>
                <p>{this.state.info}</p>
                <p>Go to&nbsp;
                  <Link to={`/bangu/${this.state.Bangu._id}`}>{this.state.Bangu.krasi_cmene}</Link>
                </p>
              </div>}
            <div className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor="exampleInputEmail1">Language</label>
                <div className="col-sm-10">
                  <input onChange={this.handleChange} type="text" className="form-control" id="bangu" value={this.state.krasi_cmene} placeholder="Pirate English"/>
                </div>
              </div>
              <div className="checkbox">
                <label>
                  <input id="bridi" onChange={this.handleChange} type="checkbox" checked={self.state.bridi}/>
                  For definitions in this language force users to fill in types
                </label>
              </div>
              <div className="form-group d-inline">
                <label className="col-sm-2 control-label">Tags</label>
                <div className="col-sm-10 d-inline">
                  {/*<TagsInput value={this.state.tcita} onChange={this.handleChangeOfTags}/>*/}
                </div>
              </div>
            </div>
            <button type="submit" onClick={this.handleSubmit} className="btn btn-primary">Add</button>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = JBangu;
