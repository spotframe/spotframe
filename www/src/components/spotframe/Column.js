import React, { Component } from 'react'

class Column extends Component {

  render() {
    return (
      <div
        className="sf-column"
        style={{
          width: '100%',
        }}
      >
        {this.props.children}
      </div>
    )
  }

}

export default Column
