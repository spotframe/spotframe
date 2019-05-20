import React, { Component } from 'react'
import axios from 'axios'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({

});

class LabelWithFetcher extends Component {
  state = {
    response: null,
  }

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/fetchers/${this.props.Fetcher}/${this.props.uuid}`)
      .then(res => { this.setState({ response: res.data }) })
  }



  render() {

    const content = (
      ( this.state.response && this.props.GetFrom )
      ? eval(`this.state.response${this.props.GetFrom}`)
      : this.state.response
    )

    return <span>{content}</span>

  }
}

LabelWithFetcher.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(LabelWithFetcher)