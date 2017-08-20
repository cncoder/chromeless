const React = require('react');
import {Link} from 'react-router';

const styleError = {
  borderRadius: 5,
  border: '1px solid #5C0000',
  backgroundColor: '#FFC1C1',
  color: '#CD0000',
  padding: 10,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 20,
  marginBottom: 20
};
const styleSuccess = {
  borderRadius: 5,
  border: '1px solid #007B0A',
  backgroundColor: '#E1F8D3',
  color: '#006A00',
  padding: 10,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 20,
  marginBottom: 20
};

class FlashMessage extends React.Component {
  /*
    * props.show -> if true, flash will show
    * props.time -> optional, ms of length of show, defaults to 3000
     */
  render() {
    const type = this.props.type || 'error';
    let style;
    switch (type) {
      case 'error':
        style = styleError;
        break;
      case 'success':
        style = styleSuccess;
        break;
      default:
        console.assert(false, 'invalid type given to FlashMessage component. type:', type);
    }

    if (this.props.visible) {
      if (this.props.flashLink) {
        return (
          <div>
            <div style={style}>{this.props.message}<br/>
              <Link to={this.props.flashLink} target="_blank">Your defs</Link>
            </div>
          </div>
        );
      }
      return (
        <p style={style}>{this.props.message}</p>
      );
    } else {
      return <p style={{
        display: 'none'
      }}></p>;
    }
  }
}

module.exports = FlashMessage;
