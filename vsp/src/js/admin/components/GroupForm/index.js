import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Button, ButtonGroup } from 'vidya/Button';
import { TextInput, Switch } from 'vidya/Form';
import { Banner } from 'vidya/Feedback';
import Select from 'react-select-plus';

import 'react-select-plus/dist/react-select-plus.css';

import { NAME } from '../../constants';
import RangeCalendar from '../RangeCalendar';

import { groupCreateValid } from '../../validation';
import { routerUtil } from '../../../utils';

import styles from './main.scss';

import AdSettingAttr from './AdSettingAttr';
import * as helper from './helper';

const cancelSubmit = () => {
  routerUtil.pushHistory(`/${NAME}/group`);
};

class GroupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupName: '',
      country: 0,
      startTime: '',
      expireTime: '',
      maxUpload: '',
      apiKey: '',
      contactName: '',
      contactGender: 0,
      contactTelephone: '',
      contactEmail: '',
      contactCompany: '',
      memo: '',
      isVip: false,
      enableHrs: false,
      isNotify: false,
      groupNameInvalid: false,
      maxUploadInvalid: false,
      emailInvalid: false,
      businessModel: null,
      platform: null,
      videoKey: null,
      customAdCategory: null,
      customAdType: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleExpireTimeChange = this.handleExpireTimeChange.bind(this);
    this.handleMaxUploadChange = this.handleMaxUploadChange.bind(this);
    this.handleContactNameChange = this.handleContactNameChange.bind(this);
    this.handleContactGenderChange = this.handleContactGenderChange.bind(this);
    this.handleTelephoneChange = this.handleTelephoneChange.bind(this);
    this.handleContactEmailChange = this.handleContactEmailChange.bind(this);
    this.handleContactCompanyChange = this.handleContactCompanyChange.bind(this);
    this.handleMemoChange = this.handleMemoChange.bind(this);
    this.handleIsVipChange = this.handleIsVipChange.bind(this);
    this.handleEnableHrsChange = this.handleEnableHrsChange.bind(this);
    this.handleIsNotifyChange = this.handleIsNotifyChange.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.handleCustomCategoryChange = this.handleCustomCategoryChange.bind(this);
    this.handleCustomTypeChange = this.handleCustomTypeChange.bind(this);
    this.handleVideoKeyChange = this.handleVideoKeyChange.bind(this);
    this.getRequiredFields = this.getRequiredFields.bind(this);
    this.passAllFormatCheck = this.passAllFormatCheck.bind(this);
  }

  componentDidMount() {
    this.props.requestCountries();
    this.props.requestAdSetting();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data.id > 0) {
      const data = nextProps.data;
      this.setState({
        groupName: data.name,
        country: !data.country ? null : data.country,
        startTime: `${data.start_time} 00:00:00`,
        expireTime: data.expire_time ? `${data.expire_time} 00:00:00` : '',
        maxUpload: data.max_upload ? data.max_upload : '',
        apiKey: !data.api_key ? null : data.api_key,
        contactName: !data.contact_name ? '' : data.contact_name,
        contactGender: !data.contact_gender ? null : data.contact_gender,
        contactTelephone: !data.contact_telephone ? '' : data.contact_telephone,
        contactEmail: !data.contact_email ? '' : data.contact_email,
        contactCompany: !data.contact_company ? '' : data.contact_company,
        memo: !data.memo ? '' : data.memo,
        isVip: Boolean(data.is_vip),
        enableHrs: Boolean(data.enable_hrs),
        isNotify: Boolean(data.is_notify),
        maxUploadInvalid: false,
        emailInvalid: false,
        businessModel: data.ad_business_model_id,
        platform: data.ad_platform_id,
        videoKey: data.ad_video_key_id,
        customAdCategory: data.custom_ad_category,
        customAdType: data.custom_ad_type,
      });
    }

    // set default values when creating a group
    if (!this.state.businessModel &&
      !this.props.match.params.group_id &&
      nextProps.modelOptions.length > 0
    ) {
      this.setState({
        businessModel: nextProps.modelOptions[0].value,
        platform: nextProps.platformOptions[0].value,
        videoKey: nextProps.videoKeysOptions[0].value,
        customAdCategory: nextProps.customCategoryOptions[0].value,
        customAdType: nextProps.customTypeOptions[0].value,
      });
    }
  }

  getRequiredFields() {
    const required = [
      this.state.groupName,
      this.state.startTime,
      this.state.expireTime,
      this.state.businessModel,
      this.state.platform,
      this.state.videoKey,
      this.state.customAdCategory,
      this.state.customAdType,
    ];

    return required;
  }

  handleSubmit(event) {
    const formResult = this.state;
    if (this.props.data && this.props.data.id > 0) {
      groupCreateValid(formResult)(this.props.updateGroup);
    } else {
      groupCreateValid(formResult)(this.props.createGroup);
    }
    routerUtil.pushHistory(`/${NAME}/group`);
    event.preventDefault();
  }

  handleGroupNameChange(groupName) {
    if (groupName.length > 32) {
      this.setState({
        groupNameInvalid: true,
      });
    } else {
      this.setState({
        groupNameInvalid: false,
        groupName,
      });
    }
  }

  handleCountryChange(selectObj) {
    if (selectObj === null) {
      this.setState({ country: 0 });
    } else {
      this.setState({ country: selectObj.value });
    }
  }

  handleStartTimeChange(startTime) {
    this.setState({
      startTime,
    });
  }

  handleExpireTimeChange(expireTime) {
    this.setState({
      expireTime,
    });
  }

  handleMaxUploadChange(maxUpload) {
    const number = Number(maxUpload);
    if (isNaN(number) || number > 2147483647) {
      this.setState({
        maxUploadInvalid: true,
        maxUpload,
      });
    } else {
      this.setState({
        maxUploadInvalid: false,
        maxUpload,
      });
    }
  }

  handleContactNameChange(contactName) {
    this.setState({ contactName });
  }

  handleContactGenderChange(contactGender) {
    this.setState({ contactGender: contactGender.value });
  }

  handleTelephoneChange(contactTelephone) {
    this.setState({ contactTelephone });
  }

  handleContactEmailChange(contactEmail) {
    const reg = new RegExp('^[A-Za-z0-9-_.]+@[A-Za-z0-9-_.]+$');
    if (contactEmail !== '' && contactEmail.match(reg) === null) {
      this.setState({
        emailInvalid: true,
        contactEmail,
      });
    } else {
      this.setState({
        emailInvalid: false,
        contactEmail,
      });
    }
  }

  handleContactCompanyChange(contactCompany) {
    this.setState({ contactCompany });
  }

  handleMemoChange(event) {
    this.setState({ memo: event.target.value });
  }

  handleIsVipChange(isVip) {
    this.setState({ isVip });
  }

  handleEnableHrsChange(enableHrs) {
    this.setState({ enableHrs });
  }

  handleIsNotifyChange(isNotify) {
    this.setState({ isNotify });
  }

  // ad setting : business model
  handleModelChange(option) {
    this.setState({
      businessModel: option.value,
    });
  }

  // ad setting : platform
  handlePlatformChange(option) {
    this.setState({
      platform: option.value,
    });
  }

  // ad setting : custom ad category
  handleCustomCategoryChange(option) {
    this.setState({
      customAdCategory: option.value,
    });
  }

  // ad setting : custom ad type
  handleCustomTypeChange(option) {
    this.setState({
      customAdType: option.value,
    });
  }

  // ad setting : custom ad type
  handleVideoKeyChange(option) {
    this.setState({
      videoKey: option.value,
    });
  }

  passAllFormatCheck() {
    const flags = [
      this.state.groupNameInvalid,
      this.state.maxUploadInvalid,
      this.state.emailInvalid,
    ];

    return flags.every(flag => !flag);
  }

  render() {
    let node = null;
    if (this.props.data && this.props.data.id > 0) {
      if (Date.parse(this.state.startTime) > Date.now() ||
        (this.state.expireTime && Date.parse(this.state.expireTime) < Date.now())) {
        node = (<Banner>此群組因為超過或未到有效日期而屬於停用狀態，請修改有效日期來啟用這個群組。</Banner>);
      }
    }

    return (
      <div styleName="container">
        <div styleName="top">
          {this.props.data && this.props.data.id > 0 ? (<h2><span styleName="nameTitle">{this.state.groupName}</span> 群組設定</h2>) : (<h2>新增群組</h2>)}
          <div>
            {node}
          </div>
        </div>
        <div styleName={!node ? 'basicInfo' : 'overTimeInfo'}>
          <div styleName="topic">
            <h2>群組基本資料</h2>
          </div>
          <div styleName="hrLine">
            <div styleName="formArea">
              <div styleName="inputField">
                <label htmlFor="groupNameInvalid-id">群組名稱*</label>
                <TextInput
                  id="groupNameInvalid-id"
                  value={this.state.groupName}
                  onChange={this.handleGroupNameChange}
                  invalid={this.state.groupNameInvalid}
                  placeholder="限制長度為32個字元，英文有大小寫之分（必填）"
                />
              </div>
              <div styleName="inputField">
                <label htmlFor="country-id">所屬地區</label>
                <Select
                  name="groupCountrySelect"
                  value={this.state.country}
                  options={this.props.countriesOptions}
                  onChange={this.handleCountryChange}
                />
              </div>
              <div styleName="inputField">
                <label htmlFor="expireTime-id">有效日期*</label>
                <RangeCalendar
                  startValue={this.state.startTime}
                  endValue={this.state.expireTime}
                  startVal={this.handleStartTimeChange}
                  endVal={this.handleExpireTimeChange}
                />
              </div>
              <div styleName="inputField">
                <label htmlFor="maxUpload-id">影片分析上限</label>
                <TextInput
                  id="maxUpload-id"
                  value={this.state.maxUpload}
                  onChange={this.handleMaxUploadChange}
                  invalid={this.state.maxUploadInvalid}
                  placeholder="上限2147483647"
                />
              </div>
              <div styleName="inputField">
                <label htmlFor="apiKey-id">API Key</label>
                {this.state.apiKey ? (
                  <div>{this.state.apiKey}</div>
                ) : (
                  <div>None</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div styleName="contactInfo">
          <div styleName="topic">
            <h2>群組聯絡資料</h2>
          </div>
          <div styleName="hrLine">
            <div styleName="formArea">
              <div styleName="inputField">
                <label htmlFor="contactName-id">聯絡窗口</label>
                <div styleName="contactInput">
                  <div styleName="contactTextBlock">
                    <TextInput
                      id="contactName-id"
                      value={this.state.contactName}
                      onChange={this.handleContactNameChange}
                    />
                  </div>
                  <div styleName="contactBtnGroup">
                    <ButtonGroup
                      onChange={this.handleContactGenderChange}
                      value={this.state.contactGender}
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
                <label htmlFor="contactTelephone-id">聯絡電話</label>
                <TextInput
                  id="contactTelephone-id"
                  value={this.state.contactTelephone}
                  onChange={this.handleTelephoneChange}
                />
              </div>
              <div styleName="inputField">
                <label htmlFor="contactEmail-id">聯絡Email</label>
                <TextInput
                  id="contactEmail-id"
                  value={this.state.contactEmail}
                  onChange={this.handleContactEmailChange}
                  invalid={this.state.emailInvalid}
                />
              </div>
              <div styleName="inputField">
                <label htmlFor="contactCompany-id">所屬公司</label>
                <TextInput
                  id="contactCompany-id"
                  value={this.state.contactCompany}
                  onChange={this.handleContactCompanyChange}
                />
              </div>
            </div>
            <div styleName="formArea">
              <div styleName="inputField">
                <label htmlFor="memo-id">備註</label>
                <textarea
                  id="memo-id"
                  styleName="MemoTextbox"
                  value={this.state.memo}
                  onChange={this.handleMemoChange}
                />
              </div>
            </div>
          </div>
        </div>
        <AdSettingAttr
          modelOptions={this.props.modelOptions}
          platformOptions={this.props.platformOptions}
          videoKeysOptions={this.props.videoKeysOptions}
          customCategoryOptions={this.props.customCategoryOptions}
          customTypeOptions={this.props.customTypeOptions}
          onModelChange={this.handleModelChange}
          onPlatformChange={this.handlePlatformChange}
          onVideoKeyChange={this.handleVideoKeyChange}
          onCategoryChange={this.handleCustomCategoryChange}
          onTypeChange={this.handleCustomTypeChange}
          model={this.state.businessModel}
          platform={this.state.platform}
          videoKey={this.state.videoKey}
          category={this.state.customAdCategory}
          type={this.state.customAdType}
        />
        <div styleName="setting">
          <div styleName="topic">
            <h2>功能設定</h2>
          </div>
          <div styleName="hrLine">
            <div styleName="inputField">
              <div styleName="switchInput">
                <Switch
                  checked={this.state.isVip}
                  onChange={this.handleIsVipChange}
                />
              </div>
              <label htmlFor="isVip-id" styleName="switchLabel">VIP 帳戶</label>
            </div>
            <div styleName="inputField">
              <div styleName="switchInput">
                <Switch
                  checked={this.state.enableHrs}
                  onChange={this.handleEnableHrsChange}
                />
              </div>
              <label htmlFor="enableHrs-id" styleName="switchLabel">HRS 分析</label>
            </div>
            <div styleName="inputField">
              <div styleName="switchInput">
                <Switch
                  checked={this.state.isNotify}
                  onChange={this.handleIsNotifyChange}
                />
              </div>
              <label htmlFor="isNotify-id" styleName="switchLabel">警報通知</label>
            </div>
          </div>
        </div>
        <div styleName="submitArea">
          <div styleName="formBtn">
            <Button
              vdSize="normal"
              vdStyle="primary"
              onClick={this.handleSubmit}
              disable={
                !this.passAllFormatCheck() ||
                !helper.isAllNonEmpty(this.getRequiredFields())
              }
            >
              儲存
            </Button>
          </div>
          <div styleName="cancelFormBtn">
            <Button vdSize="normal" vdStyle="secondary" onClick={cancelSubmit}>取消</Button>
          </div>
        </div>
      </div>
    );
  }
}

GroupForm.propTypes = {
  countriesOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  requestCountries: PropTypes.func,
  createGroup: PropTypes.func,
  updateGroup: PropTypes.func,
  data: PropTypes.object,
  modelOptions: PropTypes.array,
  platformOptions: PropTypes.array,
  videoKeysOptions: PropTypes.array,
  customCategoryOptions: PropTypes.array,
  customTypeOptions: PropTypes.array,
  requestAdSetting: PropTypes.func,
  match: PropTypes.object,
};


export default CSSModules(GroupForm, styles);
