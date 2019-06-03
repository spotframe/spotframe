import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  Column: {
    display: 'flex',
    // flexDirection: 'column',
    backgroundColor: 'green',
  },
  ColumnFullWidth: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
})

function CreateColumn(props, style) {
  const { children } = props
  return <div className={style}>{children}</div>
}


const Columns = Object.fromEntries(
  Object.keys(styles()).map(column => {

    let _klass = class extends Component {
      render() {
        return CreateColumn(this.props, this.props.classes[column])
      }
    }

    _klass.propTypes = {
      classes: PropTypes.object.isRequired,
    }

    return [column, withStyles(styles)(_klass)]
  })
)

export default withStyles(styles)(Columns)
