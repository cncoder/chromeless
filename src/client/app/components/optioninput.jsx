const React = require('react');
import {Creatable} from 'react-select-plus';

class OptionInput extends React.Component {
  render() {
    const handleChange = this.props.handleChange;
    const option = this.props.option;
    const klemei = this.props.klemei;
    const idx = option.idx;
    const sh = option.sluji_hint;
    const sluji = option.sluji;
    const terbri = this.props.terbri.slice(1);
    const places = this.props.places;
    if (option.idx === 0) {
      return (
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label"></label>
            <div className="col-sm-10">
              <input value={sluji} type="text" className="form-control" onChange={handleChange.bind(null, `sluji_${idx}`)} id={'option' + idx} placeholder={sh}/>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <div className="col-sm-2">
            <select className="form-control" name="places" defaultValue={option.nirna} onChange={handleChange.bind(null, `nirna_${idx}`)}>
              {places.map(function(i) {
                return <option value={i} key={`${option.idx}-${i}`}>{i}</option>
              })}
            </select>
          </div>
          <div className="col-sm-5">
            <div className="input-group">
              <div className="input-group-addon">(</div>
                <Creatable clearable={false} multi options={klemei} onChange={handleChange.bind(null, `klesi_${idx}`)} className="form-control" id={'klesi' + idx} value={option.klesi || []} placeholder={option.klesi_hint}/>
              <div className="input-group-addon">)</div>
            </div>
          </div>
          <div className="col-sm-5">
            <input value={sluji} type="text" onChange={handleChange.bind(null, `sluji_${idx}`)} className="form-control col-sm-5" id={'option' + idx} placeholder={sh}/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = OptionInput;
