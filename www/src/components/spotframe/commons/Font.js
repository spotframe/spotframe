import React, { Component } from 'react'

class Font extends Component {

  render() {
    return (
      <font
        face={this.props.Face}
        size={this.props.Size}
        color={this.props.Color}
      >
        {this.props.Text}
      </font>
    )
  }

}

Font.propTypes = {
  Text: PropTypes.string.isRequired,
}

export default Font