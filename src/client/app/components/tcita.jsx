const React = require('react')
import Select from 'react-select-plus'

class Tcita extends React.Component {
  render() {
    const handleChangeOfTags = this.props.handleChangeOfTags
    const idx = this.props.idx
    const tcita = this.props.tcita
    const pinka = this.props.pinka_letcita
    const tcitymei = this.props.tcitymei
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <div className="col-sm-5">
            <Select name="form-control" clearable={false} value={tcita} options={tcitymei} id={`tcita_${idx}`} key={`tcita_${idx}`} onChange={handleChangeOfTags.bind(null, `tcita_${idx}`)}/>
          </div>
          <div className="col-sm-5">
            <input onChange={handleChangeOfTags.bind(null, `pinka_${idx}`)} type="text" className="form-control" placeholder="pinka" id={`pinka_${idx}`} key={`pinka_${idx}`} value={pinka}/>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Tcita
