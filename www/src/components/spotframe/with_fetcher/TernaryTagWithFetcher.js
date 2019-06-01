import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Chip from '@material-ui/core/Chip'

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
})

class TernaryTagWithFetcher extends Component {

  render() {

    const { classes, Fetchers } = this.props
    const response = Fetchers[this.props.Fetcher]

    const content = String(
      ( response && this.props.GetFrom )
      ? window.template.renderString(
          `{${this.props.GetFrom}}`,
          { response: response }
        )
      : response
    )

    return (
      <Chip
        label={
          ( String(this.props.Equals) === content
          ? this.props.PositiveText
          : this.props.NegativeText )
        }
        style={
          ( String(this.props.Equals) === content
          ? {
              color: this.props.PositiveColor,
              backgroundColor: this.props.PositiveBackgroundColor,
            }
          : {
              color: this.props.NegativeColor,
              backgroundColor: this.props.NegativeBackgroundColor,
            }
          )
        }
        className={classes.chip} />
    )

  }
}

TernaryTagWithFetcher.propTypes = {
  classes: PropTypes.object.isRequired,
  Fetcher: PropTypes.string.isRequired,
  PositiveText: PropTypes.node.isRequired,
  NegativeText: PropTypes.node.isRequired,
}

export default withStyles(styles)(TernaryTagWithFetcher)
