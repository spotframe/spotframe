import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
})

function CreateMargin(props, style) {

  return (
    <div style={{...style}}>
      {props.children}
    </div>
  )

}

const Margins = Object.fromEntries(
  [...Array(50).keys()].map(e=>e+1).map(n =>

    ['', 'Top', 'Right', 'Bottom', 'Left'].map(o => {

      let _klass = class extends Component {
        render() {
          return CreateMargin(this.props, ({[`margin${o}`]: n}))
        }
      }

      _klass.propTypes = {
        classes: PropTypes.object.isRequired,
      }

      return [
        `Margin${o}${n}`,
        withStyles(styles)(_klass)
      ]

    })
      
  ).flat()
)


export default withStyles(styles)(Margins)
