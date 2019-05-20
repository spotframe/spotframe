import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Chip from '@material-ui/core/Chip'

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
})


class Tag extends Component {

  render() {
    const { classes } = this.props
    return <Chip label={this.props.children} className={classes.chip} />
  }
}

Tag.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Tag)