import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './Pagination.scss';


class PageButton extends React.PureComponent {
  render() {
    const { disabled, onClick, children } = this.props;
    return (
      <div
        styleName={disabled ? 'button disabled' : 'button'}
        onClick={(e) => {
          if (!disabled) { onClick(e); }
        }}
      >
        {children}
      </div>
    );
  }
}

PageButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};


export default CSSModules(PageButton, styles, { allowMultiple: true });
