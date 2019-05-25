/* eslint no-eval: 0 */
import React, { Component } from 'react'
import axios from 'axios'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({

});

class TernaryLabelWithFetcher extends Component {

  signal = axios.CancelToken.source()

  state = {
    response: null,
  }

  componentDidMount() {
    axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/fetchers/${this.props.Fetcher}/${this.props.uuid}`,
      { cancelToken: this.signal })
      .then(res => { this.setState({ response: res.data }) })
      .catch(err => {})
  }

  componentWillUnmount() {
    this.signal.cancel()
  }

  render() {

    const content = (
      ( this.state.response && this.props.GetFrom )
      ? eval(`this.state.response${this.props.GetFrom}`)
      : this.state.response
    )

    return <span>{(this.props.Equals === content ? this.props.Positive : this.props.Negative)}</span>

  }
}

TernaryLabelWithFetcher.propTypes = {
  classes: PropTypes.object.isRequired,
  uuid: PropTypes.string.isRequired,
  Fetcher: PropTypes.string.isRequired,
  Equals: PropTypes.node.isRequired,
  Positive: PropTypes.node.isRequired,
  Negative: PropTypes.node.isRequired,
}

export default withStyles(styles)(TernaryLabelWithFetcher)