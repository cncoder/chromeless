const React = require('react')
import Select from 'react-select-plus'
const p = (a, root, indent) => console.log(JSON.stringify(a, root || null, indent || 2));

class Tcita extends React.Component {
  render() {
    const handleChangeOfTags = this.props.handleChangeOfTags
    const idx = this.props.idx
    const tcita = this.props.tcita
    const pinka = this.props.pinka
    const tcitymei = this.props.tcitymei.map(i => {
      return {value: i.tcita, label: i.tcita}
    })
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <div className="col-sm-5">
            <Select name="form-control" onChange={handleChangeOfTags.bind(null, {idx, tcita})} id={`tcita_${idx}`} key={`tcita_${idx}`} value={tcita} options={tcitymei} clearable={false}/>
          </div>
          <div className="col-sm-5">
            <input onChange={handleChangeOfTags.bind(null, {idx, pinka})} id={`pinka_${idx}`} key={`pinka_${idx}`} value={pinka} type="text" className="form-control" placeholder="pinka"/>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Tcita
