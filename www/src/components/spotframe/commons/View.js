import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  View: {
    display: 'flex',
    // flexDirection: 'column',
    backgroundColor: 'blue',
  },
  ViewFull: {
    display: 'flex',
    flexGrow: 1,
  },
  ViewJustifyContentCenter: {
    display: 'flex',
    justifyContent: 'center',    
  },
  ViewJustifyContentCenterAndAlignItemsCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewJustifyContentFlexStart: {
    display: 'flex',
    justifyContent: 'flex-start',    
  },
  ViewJustifyContentFlexEnd: {
    display: 'flex',
    justifyContent: 'flex-end',    
  },
  ViewJustifyContentSpaceAround: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  ViewJustifyContentSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',    
  },
  ViewJustifyContentSpaceEvenly: {
    display: 'flex',
    justifyContent: 'space-evenly',    
  },


})

function CreateView(props, style) {
  const { children } = props
  return <div className={style}>{children}</div>
}


const Views = Object.fromEntries(
  Object.keys(styles()).map(view => {

    let _klass = class extends Component {
      render() {
        return CreateView(this.props, this.props.classes[view])
      }
    }

    _klass.propTypes = {
      classes: PropTypes.object.isRequired,
    }

    return [view, withStyles(styles)(_klass)]
  })
)

export default withStyles(styles)(Views)
