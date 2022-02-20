import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Button, ButtonGroup } from 'vidya/Button';
import { TextInput } from 'vidya/Form';
import Select from 'react-select-plus';

import 'react-select-plus/dist/react-select-plus.css';

import { NAME } from '../../constants';

import SettingBox from './SettingBox';
import PwdBtn from './PwdBtn';

import { userCreateValid } from '../../validation';
import { routerUtil } from '../../../utils';

import styles from './main.scss';

const cancelSubmit = () => {
  routerUtil.pushHistory(`/${NAME}/user`);
};

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      password: '',
      username: '',
      gender: 0,
      email: '',
      company: '',
      countryId: '',
      telNumber: '',
      memo: '',
      permissions: [],
      accountInvalid: false,
      emailInvalid: false,
      enableSubmit: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCompanyChange = this.handleCompanyChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleTelNumberChange = this.handleTelNumberChange.bind(this);
    this.handleMemoChange = this.handleMemoChange.bind(this);
  }

  componentDidMount() {
    this.props.getBriefGroups();
    this.props.getRoles();
    this.props.requestCountries();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data.uid > 0) {
      const data = nextProps.data;
      this.setState({
        account: data.account,
        password: null,
        username: data.username,
        gender: data.gender,
        email: !data.email ? null : data.email,
        company: !data.company ? null : data.company,
        countryId: data.country_id,
        telNumber: !data.tel_number ? null : data.tel_number,
        memo: !data.memo ? null : data.memo,
        permissions: data.permissions,
        accountInvalid: false,
        emailInvalid: false,
        enableSubmit: true,
      });
    }
  }

  handleSubmit(event) {
    const formResult = this.state;
    formResult.permissions = this.settingBox.getContent();
    if (this.props.data && this.props.data.uid > 0) {
      userCreateValid(formResult)(this.props.updateUser);
    } else {
      userCreateValid(formResult)(this.props.createUser);
    }
    event.preventDefault();
  }

  handleAccountChange(account) {
    const reg = new RegExp('^[A-Za-z0-9-_@]+$');
    if (account.length > 32) {
      this.setState({
        enableSubmit: false,
        accountInvalid: true,
      });
    } else if (account.length < 6 || account.match(reg) === null) {
      this.setState({
        enableSubmit: false,
        accountInvalid: true,
        account,
      });
    } else {
      this.setState({
        enableSubmit: account !== '' && this.state.username !== '' && this.state.email !== '',
        accountInvalid: false,
        account,
      });
    }
  }

  handleUsernameChange(username) {
    this.setState({
      enableSubmit: this.state.account !== '' && username !== '' && this.state.email !== '',
      username,
    });
  }

  handleGenderChange(gender) {
    this.setState({ gender: gender.value });
  }

  handleEmailChange(email) {
    const reg = new RegExp('^[A-Za-z0-9-_.]+@[A-Za-z0-9-_.]+$');
    if (email.match(reg) === null) {
      this.setState({
        enableSubmit: false,
        emailInvalid: true,
        email,
      });
    } else {
      this.setState({
        enableSubmit: this.state.account !== '' && this.state.username !== '' && email !== '',
        emailInvalid: false,
        email,
      });
    }
  }

  handleCompanyChange(company) {
    this.setState({ company });
  }

  handleCountryChange(selectObj) {
    this.setState({ countryId: selectObj.value });
  }

  handleTelNumberChange(telNumber) {
    this.setState({ telNumber });
  }

  handleMemoChange(event) {
    this.setState({ memo: event.target.value });
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="top">
          {this.props.data && this.props.data.uid > 0 ? (<h2><span styleName="nameTitle">{this.state.username}</span> 帳號設定</h2>) : (<h2>新增帳號</h2>)}
        </div>
        <div styleName="basicInfo">
          <div styleName="topic">
            <h2>帳號基本資料</h2>
          </div>
          <div styleName="hrLine">
            <div styleName="formArea">
              <div styleName="inputField">
                <label htmlFor="accountInvalid-id">帳號*</label>
                {this.props.data && this.props.data.account
                  ? (
                    <div>{this.props.data.account}</div>
                  )
                  : (
                    <TextInput
                      id="accountInvalid-id"
                      value={this.state.account}
                      onChange={this.handleAccountChange}
                      invalid={this.state.accountInvalid}
                      placeholder="6-32個半形英數字或符號「@」「 -」「_」，英文有大小寫之分（必填）"
                    />
                  )
                }
              </div>
              <div styleName="inputField">
                <label htmlFor="password-id">密碼*</label>
                <PwdBtn
                  update={this.props.data && this.props.data.uid > 0 ? true : undefined}
                  setPwd={password => this.setState({ password })}
                  password={this.state.password}
                />
              </div>
            </div>
          </div>
        </div>
        <div styleName="contactInfo">
          <div styleName="topic">
            <h2>基本資料</h2>
          </div>
          <div styleName="hrLine">
            <div styleName="formArea">
              <div styleName="inputField">
                <label htmlFor="username-id">使用者名稱*</label>
                <div styleName="contactInput">
                  <div styleName="contactTextBlock">
                    <TextInput
                      id="username-id"
                      value={this.state.username}
                      onChange={this.handleUsernameChange}
                      placeholder="輸入新名稱（必填）"
                    />
                  </div>
                  <div styleName="contactBtnGroup">
                    <ButtonGroup
                      onChange={this.handleGenderChange}
                      value={this.state.gender}
                      options={[
                        {
                          value: 1,
                          label: '男',
                        },
                        {
                          value: 0,
                          label: '女',
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div styleName="inputField">
                <label htmlFor="emailInvalid">聯絡Email*</label>
                <TextInput
                  id="emailInvalid"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  invalid={this.state.emailInvalid}
                  placeholder="輸入Email（必填）"
                />
              </div>
              <div styleName="inputField">
                <label htmlFor="company">所屬公司</label>
                <TextInput
                  id="company"
                  value={this.state.company}
                  onChange={this.handleCompanyChange}
                  placeholder="輸入公司名稱"
                />
              </div>
            </div>
            <div styleName="formArea">
              <div styleName="inputField">
                <label htmlFor="telNumber">聯絡電話</label>
                <div styleName="contactInput">
                  <div styleName="contactRegionInput">
                    <Select
                      name="userContactSelect"
                      value={this.state.countryId}
                      options={this.props.contactOptions}
                      onChange={this.handleCountryChange}
                    />
                  </div>
                  <div styleName="contactPhoneInput">
                    <TextInput
                      id="telNumber"
                      value={this.state.telNumber}
                      onChange={this.handleTelNumberChange}
                      placeholder="輸入電話號碼"
                    />
                  </div>
                </div>
              </div>
              <div styleName="inputField">
                <label htmlFor="memo-id">備註</label>
                <textarea
                  id="memo-id"
                  styleName="MemoTextbox"
                  value={this.state.memo}
                  onChange={this.handleMemoChange}
                  placeholder="輸入備註"
                />
              </div>
            </div>
          </div>
        </div>
        <div styleName="setting">
          <div styleName="topic">
            <h2>群組設定</h2>
          </div>
          <div styleName="hrLine">
            <SettingBox
              groupOptions={this.props.groupOptions}
              roleOptions={this.props.roles}
              data={this.state.permissions.length === 0 ? undefined : this.state.permissions}
              ref={(box) => { this.settingBox = box; }}
            />
          </div>
        </div>
        <div styleName="submitArea">
          <div styleName="formBtn">
            <Button vdSize="normal" vdStyle="primary" onClick={this.handleSubmit} disable={!this.state.enableSubmit}>儲存</Button>
          </div>
          <div styleName="cancelFormBtn">
            <Button vdSize="normal" vdStyle="secondary" onClick={cancelSubmit}>取消</Button>
          </div>
        </div>
      </div>
    );
  }
}

UserForm.propTypes = {
  groupOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  countriesOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  contactOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  requestCountries: PropTypes.func,
  createUser: PropTypes.func,
  updateUser: PropTypes.func,
  getBriefGroups: PropTypes.func,
  getRoles: PropTypes.func,
  data: PropTypes.object,
};


export default CSSModules(UserForm, styles);
