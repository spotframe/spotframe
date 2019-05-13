import React, { Component } from 'react'

class Row extends Component {

  render() {
    return (
      <div
        className="sf-row"
        style={{
          display: 'flex',
          justifyContent: 'space-around'
        }}
      >
        {this.props.children}
      </div>
    )
  }

}

export default Row
