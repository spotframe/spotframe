import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  span: {

  }
});

class LabelWithFetcher extends Component {

  render() {

    const { classes, Fetchers } = this.props
    const response = Fetchers[this.props.Fetcher]

    const content = (
      ( response && this.props.GetFrom )
      ? window.template.renderString(
          `{${this.props.GetFrom}}`,
          { response: response }
        )
      : response
    )

    return (
      <span className={classes.span}>
        {content}
      </span>
    )

  }
}

LabelWithFetcher.propTypes = {
  classes: PropTypes.object.isRequired,
  Fetcher: PropTypes.string.isRequired,
}

export default withStyles(styles)(LabelWithFetcher)
