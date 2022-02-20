import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import getLang from 'utility/lang'
import config from 'constants/config'
import _ from 'lodash'

class Histories extends Component {

  constructor() {
    super()
    this.state = {
      list: []
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
    let apiURL = `${config.api}api/histories/?lang=${this.lang}&limit=1000`
    fetch(apiURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(response => {
        let data = response.response_data.filter(item => item.activated === 1)
        let list = []
        data.map(item => {
          let index = _.findIndex(list, (o) => { return o.year == item.year; });
          if(index > -1) {
            list[index].data.push(item)
          } else {
            list.push({
              year: parseInt(item.year),
              data: [ item ]
            })
          }
        })
        // list.sort((a,b) => a.year < b.year)
        list = _.sortBy(list, (o) => o.year)
        _.reverse(list)

        this.setState({list})
      },
      error => {
        // error
      }
    );
  }



  render() {

    return (
      <ol className="history-block__year-list">

        {
          this.state.list.map((item, index) => {
            let data = item.data
            // data.sort((a,b) => a.priority < b.priority)
            _.sortBy(data, (o) => o.priority)
            _.reverse(data)

            return (
              <li key={item.year} className="history-block__year-list__list">
                <h3 className="date-tag font-h3 color-green">{item.year}</h3>
                <div className="info-list">
                  {
                    data.map((item2, index2) => {
                      if(item2.url == '' || item2.url == null) {
                        return <p key={index2} className="info-list__txt font-h6-sm color-dark">{item2.name}</p>
                      } else {
                        return <p key={index2} className="info-list__txt font-h6-sm color-dark">{item2.name}</p>
                        // return <p key={index2} className="info-list__txt font-h6-sm color-dark"><a href={item2.url} target="_blank" className="nav-block">{item2.name}</a></p>
                      }
                    })
                  }
                </div>
              </li>
            )
          })
        }

      </ol>
    )
  }
}


ReactDOM.render(
  <Histories />,
  document.getElementById('histories')
)
