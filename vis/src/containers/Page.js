import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'


export default class Page extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <div className="" style={{width:'100%', height:'100%'}}>
          Page
        </div>
      </Provider>
    )
  }
}

Page.propTypes = {
  store: PropTypes.object.isRequired
}
