var React = require('react');
var createReactClass = require('create-react-class');
import OptionInput from '../optioninput.jsx';
import request from 'superagent';
import _ from 'lodash';
import {getAuthenticated} from '../../stores/AppStateStore';
import {browserHistory} from 'react-router';
import FlashMessage from '../flashmessage.jsx';
import {getAllBangu, getAllKlesi} from '../../utils/utils';
import {Link} from 'react-router';
import Select from 'react-select-plus';
import {Creatable} from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

function findKey(obj, value) {
  return Object.keys(obj).filter(i => obj[i].idx === value)[0];
}

var Create = React.createClass({
  getInitialState: function() {
    return ({
      flashVisible: false,
      flashMessage: '',
      tcita: [],
      multiValue: [],
      banmei: [],
      klemei: [],
      terfanvymei: [],
      terfanva: undefined,
      bangu: undefined,
      valsi: '',
      places: [
        'x1', 'x2', 'x3'
      ],
      terbri: [
        {
          idx: 0,
          nirna: '',
          klesi_hint: '',
          sluji_hint: 'start of text'
        }, {
          idx: 1,
          nirna: 'x1',
          klesi_hint: 'types',
          sluji_hint: 'text after x1'
        }, {
          idx: 2,
          nirna: 'x2',
          klesi_hint: 'types',
          sluji_hint: 'text after x2'
        }, {
          idx: 3,
          nirna: 'x3',
          klesi_hint: 'types',
          sluji_hint: 'text after x3'
        }
      ]
    })
  },
  componentDidMount() {
    document.title = `Add definition`;
  },
  componentWillMount() {
    const self = this;
    getAllBangu(function(err, banmei) {
      if (err) {
        console.log("banmei", err);
        return;
      }
      self.setState({
        banmei: banmei.map(i => {
          const freq = i.freq
            ? `[${i.freq}] `
            : '';
          return {label: `${freq}${i.krasi_cmene}`, value: i._id};
        })
      });
      banmei.sort(function(a, b) {
        return parseInt(b.terfanva_freq || 0) - parseInt(a.terfanva_freq || 0);
      });
      self.setState({
        terfanvymei: banmei.map(i => {
          return {
            label: `[${i.terfanva_freq || 0}] ${i.krasi_cmene}`,
            value: i._id
          };
        })
      });
    });
    getAllKlesi(function(err, klemei) {
      if (err) {
        console.log("klemei", err);
        return;
      }
      self.setState({
        klemei: klemei.map(i => {
          const freq = i.freq
            ? `[${i.freq}] `
            : '';
          return {label: `${i.klesi}`, value: i.klesi};
        })
      });
    });
  },
  addOption: function(e) {
    e.preventDefault();
    var terbri = this.state.terbri;
    //last one is always post
    var last = terbri.length - 1;
    var next = terbri[last].idx + 1;
    terbri.push({idx: next, nirna: `x${next}`, klesi_hint: 'types', sluji_hint: `text after x${next}`});
    var places = this.state.places;
    places.push(`x${next}`); //todo add according to what other symbols are chosen, what about lujvo?
    this.setState({terbri: terbri, places: places});
  },

  removeOption: function(e) {
    e.preventDefault();
    if (this.state.terbri.length <= 1)
      return; //make disabled
    var terbri = this.state.terbri;
    terbri.pop();
    var places = this.state.places;
    places.pop();
    this.setState({terbri: terbri, places: places});
  },
  handleChangeOfTags: function(value) {
    this.setState({multiValue: value});
  },
  flashMessage: function(msg) {
    this.setState({flashVisible: true, flashMessage: msg});
    var self = this;
    setTimeout(function() {
      self.setState({flashVisible: false, flashMessage: ''});
    }, 3000);
  },
  handleChange: function(n_idx, e) {
    if (!e.target && (e && e.length > 0 && !e[0].value))
      return;
    const value = e.target
      ? e.target.value
      : e.map(i => i.value);
    if (n_idx < 0) {
      this.setState({valsi: value});
      return;
    }
    var terbri = this.state.terbri;
    var arr_n;
    if (n_idx.indexOf("_") === -1)
      return;
    arr_n = n_idx.split("_");
    var type = arr_n[0];
    var idx = arr_n[1];
    terbri = terbri.map(i => {
      if (i["idx"].toString() === idx) {
        i[type] = value;
      }
      return i;
    });
    //check if two elements have the same "klesi" value
    if (type === 'klesi') {
      terbri = terbri.map(i => {
        if (i.nirna === terbri[idx].nirna) {
          i.klesi = terbri[idx].klesi;
        }
        return i;
      });
    }
    this.setState({terbri: terbri});
  },
  banguChange: function(e) {
    this.setState({
      bangu: e.value || ''
    });
  },
  terfanvaChange: function(e) {
    this.setState({
      terfanva: e.value || ''
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();

    if (!getAuthenticated()) {
      browserHistory.push('/login/');
      //document.getElementById('openLoginPrompt').click();
      return;
    }
    if (!this._validateForm()) {
      document.getElementById('openBlankFieldsPrompt').click();
      return;
    }
    const self = this;
    var valsi = self.state.valsi;
    const terbri_ = self.state.terbri.map((o) => {
      return {idx: o.idx, klesi: o.klesi, nirna: o.nirna, sluji: o.sluji};
    });
    const tcita_ = self.state.multiValue.map((o) => {
      return {tcita: o.value};
    });
    request.post('api/finti/').send({bangu: self.state.bangu, terfanva: self.state.terfanva, tcita: JSON.stringify(tcita_), valsi: valsi, terbri: JSON.stringify(terbri_)}).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end(function(err, res) {
      if (res.body.err) {
        self.flashMessage(res.body.err);
        return;
      }
      if (err || !res.ok || !res.body.Valsi) {
        console.error('there was an error submitting form');
        return;
      }
      console.log('smuvelcki added to the backend db', JSON.stringify(res.body));
      browserHistory.push('/valsi/' + res.body.Valsi._id);
    });
  },
  _validateForm: function() {
    var validated = true;
    if (this.state.valsi.length < 1)
      validated = false;

    // _.forEach(this.state.terbri, function(option) {
    //   if (option.value.length < 1) {
    //     validated = false;
    //   }
    // });
    return validated;
  },
  arrowRenderer: function(a) {
    //→←
    return (
      <span>{a}</span>
    );
  },
  render: function() {
    var removeButtonClass = 'enabled';
    if (this.state.terbri.length < 1) {
      removeButtonClass = 'disabled';
    }
    var terbri = this.state.terbri;
    var self = this;
    return (
      <div className="header-content no-center">
        <div className="header-content-inner">
          <div className="Create-container">

            <button style={{
              display: 'none'
            }} id="openBlankFieldsPrompt" data-toggle="modal" data-target="#blankFieldsPrompt">
              Invisible Blank Fields Prompt
            </button>

            {/*<button style={{
              display: 'none'
            }} id="openLoginPrompt" data-toggle="modal" data-target="#loginPrompt">
              Invisible Launch Login Prompt
            </button>*/}

            <h1>Add a word or definition</h1>
            <div className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor="exampleInputEmail1">Word</label>
                <div className="col-sm-10">
                  <input onChange={this.handleChange.bind(null, -1)} type="text" className="form-control" id="word" value={this.state.word} placeholder="blalalavla"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor="exampleInputEmail1">Word in language</label>
                <div className="col-sm-7">
                  <Select name="form-control" clearable={false} arrowRenderer={() => self.arrowRenderer("←")} value={self.state.bangu} options={self.state.banmei} onChange={self.banguChange}/>
                </div>
                <div className="col-sm-3 control-label">
                  <Link className="pull-left" to="/jbangu" target="_blank">Add a language</Link>
                </div>
              </div>
              <hr/>
              <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor="exampleInputEmail1">Definition in language</label>
                <div className="col-sm-7">
                  <Select name="form-control" clearable={false} arrowRenderer={() => self.arrowRenderer("→")} value={self.state.terfanva} options={self.state.terfanvymei} onChange={self.terfanvaChange}/>
                </div>
                <div className="col-sm-3 control-label">
                  <Link className="pull-left" to="/jbangu" target="_blank">Add a language</Link>
                </div>
              </div>
              {terbri.map(function(option) {
                return <OptionInput option={option} idx={option.idx} key={option.idx} terbri={self.state.terbri} places={self.state.places} handleChange={self.handleChange} klemei={self.state.klemei}/>
              })}
              <div className="form-group">
                <label className="col-sm-2 control-label">Tags</label>
                <div className="col-sm-10">
                  <Creatable name="form-control" multi value={this.state.multiValue} options={self.state.tcita} onChange={self.handleChangeOfTags}/>
                </div>
              </div>
            </div>
            <button className="btn btn-default" onClick={this.addOption}>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </button>
            <button className={"btn btn-default " + removeButtonClass} onClick={this.removeOption}>
              <i className="fa fa-minus" aria-hidden="true"></i>
            </button>
            <button type="submit" onClick={this.handleSubmit} className="btn btn-primary">Add</button>
            <FlashMessage visible={this.state.flashVisible} message={this.state.flashMessage} type="error"/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Create;
