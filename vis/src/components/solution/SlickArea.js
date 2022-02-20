import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import getLang from 'utility/lang'
import MediaQuery from 'react-responsive'
import Slider from 'react-slick'


class SlickArea extends Component {

  constructor(props) {
    super()
    this.afterChange = this.afterChange.bind(this)

    props.target.style.display = "block"
    let target = props.target.getElementsByClassName('slick-item')
    let items = []
    for(let i=0, j=target.length; i<j; i++) {
      items.push(target[i].outerHTML)
    }
    this.state = {
      selectIndex: 0,
      items
    }
  }

  renderItem() {
    return this.state.items.map((item, index) => {
      return <div key={index} dangerouslySetInnerHTML={{ __html: item }}></div>
    })
  }

  afterChange(index) {
    this.setState({
      selectIndex: index
    })
  }

  gotoIndex(value) {
    this.refs.slider.slickGoTo(value)
  }

  render() {
    let settings = {
      infinite: false,
      speed: 500,
      variableWidth: false,
      adaptiveHeight: false,
      arrows: false,
      draggable: false,
      afterChange: this.afterChange
    };

    return (
      <div>
        <MediaQuery minWidth={768}>
          { this.renderItem() }
        </MediaQuery>

        <MediaQuery maxWidth={768 - 1}>
          <Slider ref="slider" {...settings}>
            { this.renderItem() }
          </Slider>

          <div className="page-list">
            {
              this.state.items.map((item, index) => {
                return <a key={index} onClick={this.gotoIndex.bind(this, index)} className={classnames('page-list__round', {'page-list__round--on': this.state.selectIndex === index})}></a>
              })
            }
          </div>
        </MediaQuery>

      </div>
    )
  }
}






let slickTargets = document.getElementsByClassName('slick-area')

for(let i=0, j=slickTargets.length; i< j; i++){
  ReactDOM.render(
    <SlickArea target={slickTargets[i]} />,
    slickTargets[i]
  )
}
