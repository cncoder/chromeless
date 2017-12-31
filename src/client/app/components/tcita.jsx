const React = require('react')
import Select from 'react-select-plus'
const p = (a, root, indent) => console.log(JSON.stringify(a, root || null, indent || 2));

class Tcita extends React.Component {
  render() {
    const handleChangeOfTags = this.props.handleChangeOfTags
    const id = this.props.idx
    const tcita = this.props.tcita
    const pinka = this.props.pinka
    const tcitymei = this.props.tcitymei.map(i => {
      return {value: i.tcita, label: i.tcita}
    })
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <div className="col-sm-5">
            <Select name="form-control" onChange={handleChangeOfTags.bind(null, {id, tcita, pinka})} id={`tcita_${id}`} key={`tcita_${id}`} value={tcita} options={tcitymei} clearable={false}/>
          </div>
          <div className="col-sm-5">
            <input onChange={handleChangeOfTags.bind(null, {id, tcita, pinka})} id={`pinka_${id}`} key={`pinka_${id}`} value={pinka} type="text" className="form-control" placeholder="pinka"/>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Tcita
