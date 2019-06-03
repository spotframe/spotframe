import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { default as MaterialPaper } from '@material-ui/core/Paper'


const styles = theme => ({
  paper: {
    width: '100%',
    height: '100%',
  },
})


class Paper extends Component {

  render() {
    const { classes, children } = this.props
    return (
      <MaterialPaper className={classes.paper}>
        {children}
      </MaterialPaper>
    )
  }
}

Paper.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(Paper)
