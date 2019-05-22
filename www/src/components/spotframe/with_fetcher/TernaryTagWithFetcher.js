import React, { Component } from 'react'
import axios from 'axios'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Chip from '@material-ui/core/Chip'

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
})


class TernaryTagWithFetcher extends Component {

  state = {
    response: null,
  }

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/fetchers/${this.props.Fetcher}/${this.props.uuid}`)
      .then(res => { this.setState({ response: res.data }) })
  }

  render() {

    const { classes } = this.props

    const content = (
      ( this.state.response && this.props.GetFrom )
      ? eval(`this.state.response${this.props.GetFrom}`)
      : this.state.response
    )

    return (
      <Chip
        label={(this.props.Equals === content ? this.props.PositiveText : this.props.NegativeText)}
        style={(this.props.Equals === content ? {
          color: this.props.PositiveColor,
          backgroundColor: this.props.PositiveBackgroundColor,
        } : {
          color: this.props.NegativeColor,
          backgroundColor: this.props.NegativeBackgroundColor,
        })}
        className={classes.chip} />
    )

  }
}

TernaryTagWithFetcher.propTypes = {
  classes: PropTypes.object.isRequired,
  uuid: PropTypes.string.isRequired,
  Fetcher: PropTypes.string.isRequired,
  // Equals: PropTypes.node.isRequired,
  PositiveText: PropTypes.node.isRequired,
  NegativeText: PropTypes.node.isRequired,
}

export default withStyles(styles)(TernaryTagWithFetcher)
