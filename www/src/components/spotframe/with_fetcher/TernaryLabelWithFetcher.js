import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  span: {

  }
});

class TernaryLabelWithFetcher extends Component {

  render() {

    const { classes, Fetchers } = this.props
    const response = Fetchers[this.props.Fetcher]

    const content = String(
      ( response && this.props.GetFrom )
      ? window.template.renderString(
          this.props.GetFrom,
          { response: response }
        )
      : response
    )

    return <span className={classes.span}>
      {
        ( String(this.props.Equals) === content
        ? this.props.Positive
        : this.props.Negative )
      }
    </span>

  }
}

TernaryLabelWithFetcher.propTypes = {
  classes: PropTypes.object.isRequired,
  Fetcher: PropTypes.string.isRequired,
  Positive: PropTypes.node.isRequired,
  Negative: PropTypes.node.isRequired,
}

export default withStyles(styles)(TernaryLabelWithFetcher)
