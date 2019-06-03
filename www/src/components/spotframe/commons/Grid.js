import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

// import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  root: {
    // backgroundColor: 'yellow',
    // flexGrow: 1,
  },
  paper: {
    // backgroundColor: '#FFCD34',
    display: 'inherit',
    // padding: 20,
    // margin: 10,
    // textAlign: 'center',
    // color: theme.palette.text.secondary,
  },
})

function CreateGrid(props, xs) {

  const { classes } = props

  return (
    // <Grid className={classes.root} style={{backgroundColor: `#${String(xs).repeat(6)}`}} item xs={xs}>
    <Grid className={classes.root} item xs={xs}>
      {props.children}
      {/*<Paper className={classes.paper}>{props.children}</Paper>*/}
    </Grid>
  )

}

const Grids = Object.fromEntries(
  [...Array(12).keys()].map(n => {

    let _klass = class extends Component {
      render() {
        return CreateGrid(this.props, 1+n)
      }
    }

    _klass.propTypes = {
      classes: PropTypes.object.isRequired,
    }

    return [
      `Grid${1+n}`,
      withStyles(styles)(_klass)
    ]
  })
)

export default withStyles(styles)(Grids)
