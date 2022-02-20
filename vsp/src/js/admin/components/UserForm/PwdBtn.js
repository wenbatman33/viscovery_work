import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { Button } from 'vidya/Button';

import styles from './pwdbtn.scss';

const makeHash = (length = 8) => (
  Math.random().toString(36).substring(2, length + 2)
);

class PwdBtn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 0,
    };
    this.setPassword = this.setPassword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.update) {
      if (nextProps.password === null) {
        this.setState({ status: 2 });
      } else if (nextProps.password.length > 0) {
        this.setState({ status: 3 });
      }
    }
  }

  setPassword() {
    const rdPassword = makeHash(8);
    this.setState({
      status: 1,
    });
    this.props.setPwd(rdPassword);
  }

  render() {
    return (
      <div>
        {(() => {
          switch (this.state.status) {
            case 0:
              return (
                <Button
                  vdSize="normal"
                  vdStyle="secondary"
                  onClick={this.setPassword}
                >生成密碼</Button>
              );
            case 1:
              return (
                <div styleName="wording">
                  <p>{`${this.props.password} (預設密碼)`}</p>
                </div>
              );
            case 2:
              return (
                <div styleName="renewPwd">
                  <div styleName="inlineWordbox">
                    <p styleName="inlineWording">········</p>
                  </div>
                  <div styleName="inlineBtn">
                    <Button
                      vdSize="normal"
                      vdStyle="secondary"
                      onClick={this.setPassword}
                    >重置密碼</Button>
                  </div>
                </div>
              );
            case 3:
              return (
                <div styleName="wording">
                  <p>{`${this.props.password} (新密碼)`}</p>
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    );
  }
}

PwdBtn.propTypes = {
  setPwd: PropTypes.func,
  password: PropTypes.string,
  update: PropTypes.bool,
};

PwdBtn.defaultProps = {
  update: false,
};

export default CSSModules(PwdBtn, styles);
