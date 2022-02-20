import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Button from 'vidya/Button/Button';

import styles from './StartJobWindow.scss';

class StartJobWindow extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleLoading = this.handleLoading.bind(this);

    this.state = {
      loading: false,
    };
  }

  handleLoading(loading) {
    this.setState({
      loading,
    });
  }

  render() {
    const { onClick } = this.props;
    const { loading } = this.state;

    return (
      <div styleName="container">
        <h2
          style={{
            marginBottom: '32px',
          }}
        >
          精彩的冒險開始了！
        </h2>
        <Button
          vdStyle="primary"
          vdSize="normal"
          onClick={() => {
            this.handleLoading(true);
            onClick()
              .then(() => this.handleLoading(false))
              .catch(() => this.handleLoading(false));
          }}
          disable={loading}
        >
          出發吧！勇士！
        </Button>
      </div>
    );
  }
}

StartJobWindow.propTypes = {
  onClick: PropTypes.func,
};

export default CSSModules(StartJobWindow, styles);
