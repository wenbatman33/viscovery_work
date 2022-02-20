import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
} from 'vidya/Button';
import NavLink from '../common/NavLink';

class Navbar extends React.PureComponent {
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
    const { pathname, confirm, search } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '60px',
          background: 'white',
          padding: '0 32px',
        }}
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          <NavLink
            pathname={pathname}
            search={search}
            basename="/hrs/report/settings"
            to=""
            title="分組"
          />
          <NavLink
            pathname={pathname}
            search={search}
            basename="/hrs/report/settings"
            to="shift_info"
            title="標的設定"
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            vdSize="normal"
            vdStyle="primary"
            onClick={() => {
              this.handleLoading(true);
              return confirm()
                .then(
                  () => this.handleLoading(false),
                  () => this.handleLoading(false)
                );
            }}
            disable={this.state.loading}
          >
            儲存變更
          </Button>
        </div>
      </div>
    );
  }

}

Navbar.propTypes = {
  pathname: PropTypes.string,
  search: PropTypes.string,
  confirm: PropTypes.func,
};

export default Navbar;
