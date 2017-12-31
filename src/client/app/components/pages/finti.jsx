const React = require('react')
import request from 'superagent'
const localStorage = require('web-storage')().localStorage
import {getAuthenticated} from '../../stores/AppStateStore'
import {getDefById, getAllBangu, getAllKlesi, getAllTcita} from '../../utils/utils'
import {browserHistory} from 'react-router'
import {Link} from 'react-router'
import Select from 'react-select-plus'
import {Creatable} from 'react-select-plus'
import Terbri from '../terbri.jsx'
import Tcita from '../tcita.jsx'
import FlashMessage from '../flashmessage.jsx'
import {path, reduce, mergeDeepRight} from 'ramda'
import 'react-select-plus/dist/react-select-plus.css'
function p(a, root, indent) {
  console.log(JSON.stringify(a, root || null, indent || 2))
}

const init_state = {
  flashVisible: false,
  flashLink: '',
  flashMessage: '',
  addButtonDefault: 'Add',
  addButton: 'Add',
  tcita: [],
  tcitymei: [],
  banmei: [],
  klemei: [],
  terfanvymei: [],
  selgerna_filovelski: '',
  selgerna_filovalsi: '',
  forcedoverwrite: false,
  valsi: '',
  places: [
    'x1', 'x2', 'x3'
  ],
  terbri: [
    {
      idx: 0,
      nirna: '',
      klesi_hint: '',
      sluji: '',
      sluji_hint: 'start of text'
    }, {
      idx: 1,
      nirna: 'x1',
      klesi_hint: 'types',
      sluji: '',
      sluji_hint: 'text after x1'
    }, {
      idx: 2,
      nirna: 'x2',
      klesi_hint: 'types',
      sluji: '',
      sluji_hint: 'text after x2'
    }, {
      idx: 3,
      nirna: 'x3',
      klesi_hint: 'types',
      sluji: '',
      sluji_hint: 'text after x3'
    }
  ]
}

const init_state2 = {
  flashVisible: false,
  forcedoverwrite: false,
  addButtonDefault: 'Add',
  addButton: 'Add',
  klemei: [],
  tcitymei: []
}

const LoadNewWord = (self) => {
  if (!path([
    'params', 'id'
  ], self.props)) {
    const stored_state = JSON.parse(localStorage.get('finti') || '{}')
    self.setState(reduce(mergeDeepRight, init_state, [stored_state, init_state2]))
    getComponents(self)
  } else {
    //state is stored on server
    getDefById(self.props.params.id, (err, server_state) => {
      if (err) {
        console.error('could not get a valsi from database:', err)
        return
      }
      const stored_state = reduce(mergeDeepRight, init_state, [server_state, init_state2])
      stored_state.tcita = stored_state.tcita.map(i => {
        return {
          tcita: i.tcita.tcita || '',
          pinka: i.pinka || ''
        }
      })
      stored_state.terbri = stored_state.terbri.map(o => {
        return {
          idx: o.idx,
          sluji: o.sluji,
          nirna: o.nirna,
          klesi: o.klesi.map(i => i.klesi)
        }
      })
      self.setState(stored_state)
      getComponents(self)
    })
  }
}

class BaseComponent extends React.Component {
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this))
  }
}

const UniquifyArray = (arr, cmima, state_key, state) => {
  const a = [...new Set(arr.map(i => {
      const b = JSON.stringify(cmima.reduce((acc, j) => {
        acc[j] = i[j]
        return acc
      }, {}))
      return b
    }))].map(i => JSON.parse(i))
  const newstate = {}
  newstate[state_key] = a
  state.setState(newstate)
}

function getComponents(self) {
  getAllBangu((err, banmei) => {
    if (err) {
      console.log("banmei", err)
      return
    }
    self.setState({
      banmei: banmei.map(i => {
        const freq = i.freq
          ? `[${i.freq}] `
          : ''
        return {label: `${freq}${i.krasi_cmene}`, value: i._id}
      })
    })
    banmei.sort((a, b) => {
      return parseInt(b.terfanva_freq || 0) - parseInt(a.terfanva_freq || 0)
    })
    self.setState({
      terfanvymei: banmei.map(i => {
        const freq = i.terfanva_freq
          ? `[${i.terfanva_freq}] `
          : ''
        return {label: `${freq}${i.krasi_cmene}`, value: i._id}
      })
    })
  })
  getAllKlesi((err, res) => {
    if (err) {
      console.log("klemei", err)
      return
    }
    const local_klemei = self.state.terbri.reduce((acc, i) => {
      return acc.concat(i.klesi);
    }, []).filter(Boolean)
    const gunma = [...new Set((res.map(i => i.klesi).concat(local_klemei)))].map(i => {
      return {label: i, value: i}
    })
    self.setState({klemei: gunma})
  })
  getAllTcita((err, res) => {
    if (err) {
      console.log("tcitymei", err)
      return
    }
    UniquifyArray(res.map(i => {
      return {tcita: i.tcita}
    }).concat(self.state.tcita.map(i => {
      return {tcita: i.tcita}
    })), ["tcita"], "tcitymei", self)
  })
}
class Create extends BaseComponent {
  constructor() {
    super()
    this._bind('handleSubmit', 'handleClear', 'handleChange', 'handleChangeWord', 'addOption', 'addTag', 'removeOption', 'selgerna_filovalsiChange', 'selgerna_filovelskiChange', 'handleChangeOfTags')
    this.state = init_state
  }
  componentDidMount() {
    document.title = `Add definition`
  }
  componentDidUpdate(prevProps, prevState) {
    if (!path([
      'params', 'id'
    ], this.props) && !path([
      'params', 'id'
    ], prevProps)) {
      localStorage.set('finti', JSON.stringify(this.state)) //Returns false, unsuccessful
    }
    if ((path([
      'params', 'id'
    ], this.props) || '') !== (path([
      'params', 'id'
    ], prevProps) || '')) {
      const stored_state = JSON.parse(localStorage.get('finti') || '{}')
      LoadNewWord(this)
    }
  }
  componentWillMount() {
    LoadNewWord(this)
  }
  addTag(e) {
    e.preventDefault()
    let tcita = this.state.tcita
    tcita.push({tcita: '', pinka: ''});
    this.setState({tcita})
  }
  addOption(e) {
    e.preventDefault()
    const terbri = this.state.terbri
    //last one is always post
    const last = terbri.length - 1
    const next = terbri[last].idx + 1
    terbri.push({idx: next, nirna: `x${next}`, klesi_hint: 'types', sluji_hint: `text after x${next}`})
    const places = this.state.places
    places.push(`x${next}`) //todo add according to what other symbols are chosen, what about lujvo?
    this.setState({terbri: terbri, places: places})
  }

  removeOption(e) {
    e.preventDefault()
    if (this.state.terbri.length <= 1)
      return //make disabled
    let terbri = this.state.terbri
    terbri.pop()
    let places = this.state.places
    places.pop()
    this.setState({terbri: terbri, places: places})
  }
  flashMessage(msg, persistent, flashLink) {
    this.setState({flashVisible: true, flashMessage: msg, flashLink})
    const self = this
    if (persistent)
      return
    setTimeout(() => {
      self.setState({flashVisible: false, flashMessage: '', flashLink})
    }, 3000)
  }
  handleClear() {
    this.setState({terbri: init_state.terbri, valsi: '', selgerna_filovalsi: '', selgerna_filovelski: '', tcita: []})
  }

  handleChangeOfTags(value) {
    p(value)
    const self = this
    this.setState({tcita: value})
    return
    // p(value)
    // p(this.state.tcitymei)
    getAllTcita((err, res) => {
      if (err) {
        console.log("tcitymei", err)
        return
      }
      UniquifyArray(res.map(i => {
        return {value: i.tcita, label: i.pinka}
      }).concat(self.state.tcita.map(i => {
        return {value: i.tcita, label: i.tcita}
      })), [
        "value", "label"
      ], "tcitymei", self)
    })
  }

  handleChangeWord(e) {
    this.setState({valsi: e.target.value})
  }

  handleChange(n, e) {
    this.setState({forcedoverwrite: false, addButton: this.state.addButtonDefault, flashVisible: false})
    p(n)
    p(e.length)
    const type = Object.keys(n)[0]
    const idx = n[type]
    const value = type==='klesi'
    ? e.map(i => i.value)
    : e.target.value
    let terbri = this.state.terbri.map(i => {
      if (i["idx"].toString() === idx.toString()) {
        i[type] = value
      }
      return i
    })
    //check if two elements have the same "klesi" value
    if (type === 'klesi') {
      this.setState({
        'klemei': [...new Set(this.state.klemei.concat(value))]
      })
      terbri = terbri.map(i => {
        if (i.nirna === terbri[idx].nirna) {
          i.klesi = terbri[idx].klesi
        }
        return i
      })
    }
    this.setState({terbri})
  }
  selgerna_filovalsiChange(e) {
    this.setState({selgerna_filovalsi: e.value})
  }
  selgerna_filovelskiChange(e) {
    this.setState({selgerna_filovelski: e.value})
  }
  handleSubmit(e) {
    e.preventDefault()

    if (!getAuthenticated()) {
      browserHistory.push('/login/')
      //document.getElementById('openLoginPrompt').click()
      return
    }
    if (!this._validateForm()) {
      document.getElementById('openBlankFieldsPrompt').click()
      return
    }
    const self = this
    const terbri_ = self.state.terbri.map((o) => {
      return {idx: o.idx, klesi: o.klesi, nirna: o.nirna, sluji: o.sluji}
    })
    const tcita_ = self.state.tcita.map((o) => {
      return {tcita: o.value}
    })
    const valsi_id = path([
      'params', 'id'
    ], self.props)
      ? self.props.params.id
      : null
    request.post('/api/finti/').send({
      forcedoverwrite: self.state.forcedoverwrite,
      selgerna_filovalsi: self.state.selgerna_filovalsi,
      selgerna_filovelski: self.state.selgerna_filovelski,
      tcita: JSON.stringify(tcita_),
      valsi: self.state.valsi,
      terbri: JSON.stringify(terbri_),
      valsi_id
    }).set('Accept', 'application/json').set('Content-Type', 'application/x-www-form-urlencoded').end((err, res) => {
      self.setState({forcedoverwrite: false, addButton: self.state.addButtonDefault})
      if (res.body.err) {
        self.flashMessage(res.body.err)
        return
      }
      if (res.body.kunti) {
        self.flashMessage(`next time you press 'Add' the following klesi will be created: ${res.body.klemei.join(", ")}`, true)
        self.setState({forcedoverwrite: true, addButton: 'Add with klesi'})
        return
      }
      if (res.body.xaho) {
        const f = res.body.vlamei[0].item
        self.flashMessage(`Warning. This word already has some definitions from you. Press 'Add' again to ignore this warning.`, true, `sisku?morna=valsi&finti=${f.finti || ''}&valsi=${f.valsi || ''}&selgerna_filovalsi=${f.selgerna_filovalsi || ''}`)
        self.setState({forcedoverwrite: true, addButton: 'Add with klesi'})
        return
      }
      if (err || !res.ok || !res.body.Valsi) {
        console.error('there was an error submitting form')
        return
      }
      console.log('smuvelcki added to the backend db', JSON.stringify(res.body))
      browserHistory.push('/finti/' + res.body.Valsi._id)
    })
  }
  _validateForm() {
    let validated = true
    if (this.state.valsi.length < 1)
      validated = false
    return validated
  }
  arrowRenderer(a) {
    return (
      <span>{a}</span>
    )
  }
  render() {
    let removeButtonClass = 'enabled'
    if (this.state.terbri.length < 1) {
      removeButtonClass = 'disabled'
    }
    const terbri = this.state.terbri
    const self = this
    const valsi = self.state.valsi || ''
    return (
      <div className="header-content no-center">
        <div className="header-content-inner">
          <div className="Create-container">
            <button style={{
              display: 'none'
            }} id="openBlankFieldsPrompt" data-toggle="modal" data-target="#blankFieldsPrompt">
              Invisible Blank Fields Prompt
            </button>
            <h1>Add a definition</h1>
            <div className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor="exampleInputEmail1">Text</label>
                <div className="col-sm-10">
                  <input onChange={self.handleChangeWord.bind(null)} type="text" className="form-control" placeholder="blalalavla" id="valsi" value={valsi || ''}/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor="exampleInputEmail1">Language of text</label>
                <div className="col-sm-7">
                  <Select name="form-control" clearable={false} arrowRenderer={() => self.arrowRenderer("←")} value={self.state.selgerna_filovalsi} options={self.state.banmei} onChange={self.selgerna_filovalsiChange}/>
                </div>
                <div className="col-sm-3 control-label">
                  <Link className="pull-left" to="/jbangu" target="_blank">Add a language</Link>
                </div>
              </div>
              <hr/>
              <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor="exampleInputEmail1">Language of definition</label>
                <div className="col-sm-7">
                  <Select name="form-control" clearable={false} arrowRenderer={() => self.arrowRenderer("→")} value={self.state.selgerna_filovelski} options={self.state.terfanvymei} onChange={self.selgerna_filovelskiChange}/>
                </div>
                <div className="col-sm-3 control-label">
                  <Link className="pull-left" to="/jbangu" target="_blank">Add a language</Link>
                </div>
              </div>
              {terbri.map(option => <Terbri option={option} key={option.idx} places={self.state.places} handleChange={self.handleChange} klemei={self.state.klemei}/>)}
              <div className="form-group">
                <button className="btn btn-default" onClick={self.addOption}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
                <button className={"btn btn-default " + removeButtonClass} onClick={self.removeOption}>
                  <i className="fa fa-minus" aria-hidden="true"></i>
                </button>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Tcita form</label>
                <div className="col-sm-10">
                  {self.state.tcita.map((t, index) => {
                    return (<Tcita handleChangeOfTags={self.handleChangeOfTags} idx={`tcita_select_${index}`} key={`tcita_select_${index}`} tcita={t.tcita} pinka={t.pinka} tcitymei={self.state.tcitymei}/>)
                  })}
                </div>
              </div>
            </div>
            <div className="form-group">
              <button className="btn btn-default" onClick={self.addTag}>
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
              <button className={"btn btn-default " + removeButtonClass} onClick={self.removeTag}>
                <i className="fa fa-minus" aria-hidden="true"></i>
              </button>
            </div>
            <button className="btn btn-default" onClick={self.handleClear}>Clear</button>
            <button type="submit" onClick={self.handleSubmit} className="btn btn-primary">{self.state.addButton}</button>
            <FlashMessage visible={self.state.flashVisible} message={self.state.flashMessage} flashLink ={self.state.flashLink} type="error"/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Create
