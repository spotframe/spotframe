import React, { Component } from 'react'

class Font extends Component {

  render() {
    return (
      <font
        face={this.props.face}
        size={this.props.size}
        color={this.props.color}
      >
        {this.props.children}
      </font>
    )
  }

}

export default Font