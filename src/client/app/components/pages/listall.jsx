const React = require('react')
import {getAllDefs} from '../../utils/utils'
import {Link} from 'react-router'
const p = (a) => console.log(JSON.stringify(a, null, 2))

class ListAll extends React.Component {
  constructor() {
    super()
    this.state = {
      vlamei: []
    }
  }
  componentWillMount() {
    const self = this
    getAllDefs((err, vlamei) => {
      if (!err)
        self.setState({vlamei})
      }
    )
  }
  componentDidMount() {
    document.title = "All definitions"
  }
  render() {
    const self = this
    const allvlamei = this.state.vlamei.err?[]:this.state.vlamei
    return (
      <div className="header-content">
        <div className="header-content-inner">
          <div>
            <h1>All definitions</h1>
            <hr/>
            <ul className="list-group-horizontal row">
              {allvlamei.map(({_id, valsi}) => {
                return (
                  <li className="list-group-item col-xs-4" key={`/jorne/${_id}`}>
                    <Link to={`/valsi/${_id}`}>{valsi}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ListAll
