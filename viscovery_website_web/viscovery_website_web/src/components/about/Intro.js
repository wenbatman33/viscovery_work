import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import getLang from 'utility/lang'
import config from 'constants/config'

class Intro extends Component {

  constructor() {
    super()
    this.state = {
      context: ''
    }
    let lang = getLang();
    switch(lang) {
      case 'zh-hans': // 簡中
        this.lang = 2
        break
      case 'zh-hant': // 繁中
        this.lang = 1
        break
      case 'en':
      default:
        this.lang = 0
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    let apiURL = `${config.api}api/intro/?lang=${this.lang}`
    fetch(apiURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(response => {
        this.setState({
          context: response.response_data.context || ''
        })
      },
      error => {
        // error
      }
    );
  }



  render() {

    return (
      <div dangerouslySetInnerHTML={{__html: this.state.context}}>

      </div>
    )
  }
}


ReactDOM.render(
  <Intro />,
  document.getElementById('intro')
)
