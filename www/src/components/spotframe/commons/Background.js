import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  White: {
    backgroundColor: 'white',
  },
})

function CreateBackground(props, style) {
  const { children } = props
  return <div className={style}>{children}</div>
}


const Backgrounds = Object.fromEntries(
  Object.keys(styles()).map(view => {

    let _klass = class extends Component {
      render() {
        return CreateBackground(this.props, this.props.classes[view])
      }
    }

    _klass.propTypes = {
      classes: PropTypes.object.isRequired,
    }

    return [`Background${view}`, withStyles(styles)(_klass)]
  })
)

export default withStyles(styles)(Backgrounds)
