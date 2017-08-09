var React = require('react');
import {Creatable} from 'react-select-plus';

var OptionInput = React.createClass({
  render: function() {
    //this.handleChange = this.props.handleChange.bind(this);
    var handleChange = this.props.handleChange;
    var option = this.props.option;
    const klemei = this.props.klemei;
    //console.log(JSON.stringify(option));
    var idx = option.idx;
    var sh = option.sluji_hint;
    var terbri = this.props.terbri.slice(1);
    var places = this.props.places;
    /*
    <div className="form-group d-inline">
        <label className="col-sm-2 control-label" htmlFor="exampleInputPassword1">{label}</label>
        <div className="col-sm-10 d-inline">
            <input type="text"
                   onChange={handleChange.bind(null,idx)}
                   className="form-control"
                   id={'option'+idx}
                   placeholder={value} />
        </div>
    </div>
    */
    if (option.idx === 0) {
      return (
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label"></label>
            <div className="col-sm-10">
              <input type="text" className="form-control" onChange={handleChange.bind(null, `sluji_${idx}`)} id={'option' + idx} placeholder={sh}/>
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
            <input type="text" onChange={handleChange.bind(null, `sluji_${idx}`)} className="form-control col-sm-5" id={'option' + idx} placeholder={sh}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OptionInput;
