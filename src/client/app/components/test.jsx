var React = require('react');

class Test extends React.Component {
  render() {
    return (
      <h1 style={{
        color: '#FFF'
      }}>testing {this.props.params.id}</h1>
    );
  }
}

module.exports = Test;
