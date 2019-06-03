import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
	h: {}
})

function CreateHeader(props, h) {
  const { classes, children } = props
  return React.createElement(
  	`h${h}`,
  	{ className: classes.h, ...props },
  	children
  )
}

const Headers = Object.fromEntries(
  [...Array(6).keys()].map(n => {

    let _klass = class extends Component {
      render() {
        return CreateHeader(this.props, 1+n)
      }
    }

    _klass.propTypes = {
      classes: PropTypes.object.isRequired,
    }

    return [
      `HeaderH${1+n}`,
      withStyles(styles)(_klass)
    ]
  })
)

export default withStyles(styles)(Headers)
