import React, { Component } from 'react'

class Link extends Component {

  render() {
    return <a href={this.props.Href}>{this.props.Text}</a>
  }

}

export default Link
