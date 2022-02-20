/**
* Created Date : 2017/5/2
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.com>
* Contributor :
* Description : The list item of custom filter list and custom ad category list
*/
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './FilterListItem.scss';

class FilterListItem extends React.PureComponent {
  state = {
    mouseOver: false,
  };

  handleMouseOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.state.mouseOver) {
      this.setState({
        mouseOver: true,
      });
    }
  };

  handleMouseLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      mouseOver: false,
    });
  };

  handleHoverIconClick = () => {
    if (this.props.onHoverIconClick) {
      this.props.onHoverIconClick(this.props.eventKey);
    }
  };

  handleClick = () => {
    if (this.props.onItemClick) {
      this.props.onItemClick(this.props.eventKey);
    }
  };

  handleIconClick = (e) => {
    e.stopPropagation();
    if (this.props.onIconClick) {
      this.props.onIconClick(this.props.eventKey);
    }
  };

  render() {
    const { hoverIcon, icon } = this.props;
    const { mouseOver } = this.state;

    return (
      <div
        styleName="container"
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          onMouseOver={this.handleMouseOver}
          onClick={this.handleClick}
          styleName={mouseOver ? 'card-hover' : 'card'}
          title={String(this.props.children)}
        >
          <div styleName="text">
            {this.props.children}
          </div>
          <div
            styleName="icon"
            onClick={this.handleIconClick}
          >
            {
              icon && icon === 'cog' ?
                <i className="fa fa-cog" aria-hidden="true" /> :
                null
            }
            {
              icon && icon === 'plus' ?
                <span>&#43;</span> :
                null
            }
            {
              icon && icon === 'times' ?
                <i className="fa fa-times" aria-hidden="true" /> :
                null
            }
          </div>
        </div>
        {
          hoverIcon ?
            (
              <div
                onClick={this.handleHoverIconClick}
                styleName={`hover-icon-${mouseOver ? 'show' : 'hide'}`}
              >
                {
                  hoverIcon === 'trash' ?
                    <i className="fa fa-trash" aria-hidden="true" /> :
                    null
                }
                {
                  hoverIcon === 'times' ?
                    <i className="fa fa-times" aria-hidden="true" /> :
                    null
                }
              </div>
            )
            :
            null
        }
      </div>
    );
  }
}

FilterListItem.propTypes = {
  // add option 'none' to keep a space for the icon but now showing anything
  hoverIcon: PropTypes.oneOf([
    'trash', 'times', 'none',
  ]),
  icon: PropTypes.oneOf([
    'cog', 'plus', 'times',
  ]),
  eventKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onItemClick: PropTypes.func,
  onHoverIconClick: PropTypes.func,
  onIconClick: PropTypes.func,
  children: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
    ]
  ),
};


export default CSSModules(FilterListItem, styles);
