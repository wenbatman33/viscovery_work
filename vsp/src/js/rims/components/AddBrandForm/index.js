import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import $ from 'jquery';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';

import { NAME } from '../../constants';
import styles from './AddBrandForm.scss';
import WarningArea from './WarningArea';
import TypeFields from './TypeFields';
import MemoArea from './MemoArea';

const menuStyle = {
  background: 'white',
  maxHeight: '116px',
  overflowY: 'scroll',
  border: '1px solid rgba(0, 0, 0, .2)',
  marginTop: '1px',
  paddingTop: '9px',
  boxSizing: 'content-box',
};

const nonMenuStyle = {
  background: 'white',
  maxHeight: '116px',
  overflowY: 'scroll',
};

const renderItemStyles = {
  item: {
    marginBottom: '16px',
    padding: '2px 6px',
    cursor: 'default',
    fontSize: '14px',
  },
  highlightedItem: {
    marginBottom: '16px',
    padding: '2px 6px',
    cursor: 'default',
    fontSize: '14px',
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
  },
};

const inputProps = {
  placeholder: '',
  style: {
    width: '200px',
    height: '36px',
    border: '1px solid rgba(0, 0, 0, .2)',
    paddingLeft: '8px',
  },
};

const getDataByType = (fieldType, classesData, brandsData, classIds, brandIds) => {
  let allData = {};
  let dataIds = [];
  switch (fieldType) {
    case 'class': {
      allData = classesData;
      dataIds = classIds;
      break;
    }
    case 'brand': {
      allData = brandsData;
      dataIds = brandIds;
      break;
    }
    default: break;
  }

  return { allData, dataIds };
};

const stateNameProperties = {
  tw: 'twName',
  en: 'enName',
  cn: 'cnName',
};

const mapLocaleStateNameProperty = (locale, fieldType) => {
  const stateNameType = fieldType === 'class' ? 'classNames' : 'brandNames';
  switch (locale) {
    case 'tw': return { stateNameType, stateNameProperty: stateNameProperties.tw };
    case 'en': return { stateNameType, stateNameProperty: stateNameProperties.en };
    case 'cn': return { stateNameType, stateNameProperty: stateNameProperties.cn };
    default: return null;
  }
};

const dataLocaleProperties = {
  tw: 'name_zh_tw',
  en: 'name',
  cn: 'name_zh_cn',
};

const mapLocaleDataProperty = (locale) => {
  switch (locale) {
    case 'tw': return dataLocaleProperties.tw;
    case 'en': return dataLocaleProperties.en;
    case 'cn': return dataLocaleProperties.cn;
    default: return null;
  }
};

const getAllSuggestionsByLocale = (locale, allData, dataIds) => {
  const allSuggestions = [];
  const classBrandNamesProperty = mapLocaleDataProperty(locale);

  dataIds.forEach((dataId, index) => {
    allSuggestions.push({
      name: allData[dataId][classBrandNamesProperty],
      locale,
      index,
      vsp_id: allData[dataId].vsp_id || '',
    });
  });

  return allSuggestions;
};

const checkIsBrandSameAsClass = (classNames, brandNames) =>
  !Object.keys(brandNames).some(nameProperty =>
    brandNames[nameProperty].trim() !== classNames[nameProperty].trim()
  );

const localState = {
  classNames: {
    [stateNameProperties.tw]: '',
    [stateNameProperties.en]: '',
    [stateNameProperties.cn]: '',
  },
  genBrandBoxEnabled: false,
  brandNames: {
    [stateNameProperties.tw]: '',
    [stateNameProperties.en]: '',
    [stateNameProperties.cn]: '',
  },
  memoValue: '',
  isEditBrandForm: false,
  brandId: null,
};

const getClassId = brandData => parseInt(brandData.vsp_id.split('-')[1], 10);

const getClassNamesOfBrand = (brandData, classesData) => {
  const classObj = classesData[getClassId(brandData)];
  const { name, name_zh_tw, name_zh_cn } = classObj;

  return {
    name,
    name_zh_tw,
    name_zh_cn,
  };
};

class AddBrandForm extends React.Component {
  constructor(props) {
    super(props);

    this.getSuggestItems = this.getSuggestItems.bind(this);
    this.classTwInputChange = this.classTwInputChange.bind(this);
    this.classEnInputChange = this.classEnInputChange.bind(this);
    this.classCnInputChange = this.classCnInputChange.bind(this);
    this.itemSelected = this.itemSelected.bind(this);
    this.hasClassNamesNotEntered = this.hasClassNamesNotEntered.bind(this);
    this.isClassExist = this.isClassExist.bind(this);

    this.brandTwInputChange = this.brandTwInputChange.bind(this);
    this.brandEnInputChange = this.brandEnInputChange.bind(this);
    this.brandCnInputChange = this.brandCnInputChange.bind(this);
    this.setStateBrandNames = this.setStateBrandNames.bind(this);
    this.setGenBrandBox = this.setGenBrandBox.bind(this);
    this.handleMemoChange = this.handleMemoChange.bind(this);

    this.initializeLocalState = this.initializeLocalState.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isEnteredBrandOriginal = this.isEnteredBrandOriginal.bind(this);
    this.isEnNamesValid = this.isEnNamesValid.bind(this);
    this.isFormSubmitable = this.isFormSubmitable.bind(this);
    this.isFailedBrandEntered = this.isFailedBrandEntered.bind(this);

    this.state = $.extend(true, {}, localState);
  }

  componentWillMount() {
    if (typeof (this.props.brandData) !== 'undefined') {
      const { brandData, classesData } = this.props;
      const classNamesObj = getClassNamesOfBrand(brandData, classesData);

      const editBrandLocalState = {
        classNames: {
          [stateNameProperties.tw]: classNamesObj.name_zh_tw,
          [stateNameProperties.en]: classNamesObj.name,
          [stateNameProperties.cn]: classNamesObj.name_zh_cn,
        },
        genBrandBoxEnabled: false,
        brandNames: {
          [stateNameProperties.tw]: brandData.name_zh_tw,
          [stateNameProperties.en]: brandData.name,
          [stateNameProperties.cn]: brandData.name_zh_cn,
        },
        memoValue: brandData.memo || '',
        isEditBrandForm: true,
        brandId: brandData.id,
      };

      this.setState(editBrandLocalState);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isEditBrandForm && nextProps.editBrandFailedList.length === 0) {
      const { brandData, classesData } = nextProps;
      const classNamesObj = getClassNamesOfBrand(brandData, classesData);

      const editBrandLocalState = {
        classNames: {
          [stateNameProperties.tw]: classNamesObj.name_zh_tw,
          [stateNameProperties.en]: classNamesObj.name,
          [stateNameProperties.cn]: classNamesObj.name_zh_cn,
        },
        genBrandBoxEnabled: false,
        brandNames: {
          [stateNameProperties.tw]: brandData.name_zh_tw,
          [stateNameProperties.en]: brandData.name,
          [stateNameProperties.cn]: brandData.name_zh_cn,
        },
        memoValue: brandData.memo || '',
        isEditBrandForm: true,
        brandId: brandData.id,
      };

      this.setState(editBrandLocalState);
    }
  }

  getSuggestItems(locale, fieldType) {
    const { classesData, brandsData, classIds, brandIds } = this.props;

    const {
      allData,
      dataIds,
    } = getDataByType(fieldType, classesData, brandsData, classIds, brandIds);
    const allSuggestions = getAllSuggestionsByLocale(locale, allData, dataIds);
    const { stateNameType, stateNameProperty } = mapLocaleStateNameProperty(locale, fieldType);

    return allSuggestions.filter(suggestItem =>
      suggestItem.name.toLowerCase()
        .indexOf(this.state[stateNameType][stateNameProperty].toLowerCase()) > -1
    );
  }

  setStateBrandNames(newBrandNameStateObj) {
    const newState = { ...this.state };
    newState.brandNames = newBrandNameStateObj;

    this.setState(newBrandNameStateObj);
  }

  setGenBrandBox(checked) {
    this.setState({
      genBrandBoxEnabled: checked,
    });
  }

  classTwInputChange(event, value) {
    const newState = { ...this.state };
    newState.classNames[stateNameProperties.tw] = value;

    if (this.state.genBrandBoxEnabled) {
      newState.brandNames[stateNameProperties.tw] = value;
    }

    this.setState(newState);
  }

  classEnInputChange(event, value) {
    const newState = { ...this.state };
    newState.classNames[stateNameProperties.en] = value;

    if (this.state.genBrandBoxEnabled) {
      newState.brandNames[stateNameProperties.en] = value;
    }

    this.setState(newState);
  }

  classCnInputChange(event, value) {
    const newState = { ...this.state };
    newState.classNames[stateNameProperties.cn] = value;

    if (this.state.genBrandBoxEnabled) {
      newState.brandNames[stateNameProperties.cn] = value;
    }

    this.setState(newState);
  }

  brandTwInputChange(event, value) {
    const newState = { ...this.state };
    newState.brandNames[stateNameProperties.tw] = value;

    this.setState(newState);
  }

  brandEnInputChange(event, value) {
    const newState = { ...this.state };
    newState.brandNames[stateNameProperties.en] = value;

    this.setState(newState);
  }

  brandCnInputChange(event, value) {
    const newState = { ...this.state };
    newState.brandNames[stateNameProperties.cn] = value;

    this.setState(newState);
  }

  itemSelected(event, item) {
    const filedType = item.vsp_id.length === 0 ? 'class' : 'brand';
    const { stateNameType, stateNameProperty } = mapLocaleStateNameProperty(item.locale, filedType);

    const newState = { ...this.state };
    newState[stateNameType][stateNameProperty] = item.name;

    if (this.state.genBrandBoxEnabled) {
      newState.brandNames[stateNameProperty] = item.name;
    }

    this.setState(newState);
  }

  hasClassNamesNotEntered() {
    return Object.keys(stateNameProperties).some(nameProperty =>
      this.state.classNames[stateNameProperties[nameProperty]].trim().length === 0
    );
  }

  isClassExist() {
    const { classesData, classIds } = this.props;

    if (!this.hasClassNamesNotEntered()) {
      return classIds.some(classId => (
        (classesData[classId].name === this.state.classNames.enName.trim())
        && (classesData[classId].name_zh_tw === this.state.classNames.twName.trim())
        && (classesData[classId].name_zh_cn === this.state.classNames.cnName.trim()))
      );
    }

    return false;
  }

  handleMemoChange(event) {
    const memoValue = event.target.value;

    this.setState({
      memoValue,
    });
  }

  initializeLocalState() {
    this.setState($.extend(true, {}, localState));
  }

  handleCloseModal() {
    if (this.state.isEditBrandForm) {
      this.props.closeEditBrandModal();
      return;
    }

    this.initializeLocalState();
    this.props.clearAddFailedBrand();
    this.props.dispatchCancelModal();
  }

  handleSubmit() {
    const submitBrandData = {
      class_name_zh_tw: this.state.classNames.twName.trim(),
      class_name_en_us: this.state.classNames.enName.trim(),
      class_name_zh_cn: this.state.classNames.cnName.trim(),
      brand_name_zh_tw: this.state.brandNames.twName.trim(),
      brand_name_en_us: this.state.brandNames.enName.trim(),
      brand_name_zh_cn: this.state.brandNames.cnName.trim(),
      memo: this.state.memoValue.trim().length > 0 ? this.state.memoValue.trim() : '',
    };

    if (this.state.isEditBrandForm) submitBrandData.id = this.state.brandId;
    else submitBrandData.model_id = this.props.modelId;

    this.props.submitForm(submitBrandData, this.handleCloseModal);
  }

  isEnteredBrandOriginal() {
    const isEnteredClassExist = !this.hasClassNamesNotEntered() && this.isClassExist();
    const { classNames, brandNames } = this.state;
    const isBrandSameAsClass = checkIsBrandSameAsClass(classNames, brandNames);
    let isEnteredBrandOriginal = false;
    if (isEnteredClassExist && isBrandSameAsClass) {
      isEnteredBrandOriginal = true;
    }

    return isEnteredBrandOriginal;
  }

  isEnNamesValid() {
    const enNames = [this.state.classNames.enName, this.state.brandNames.enName];

    return !enNames.some(name => name.indexOf('-') > -1);
  }

  isFormSubmitable(showMemoAreaWarning) {
    if (showMemoAreaWarning) {
      return this.state.memoValue.length > 0 && this.isEnNamesValid();
    }

    const { classNames, brandNames } = this.state;
    const checkNames = [...Object.values(classNames), ...Object.values(brandNames)];

    return !checkNames.some(name => name.trim().length === 0) && this.isEnNamesValid();
  }

  isFailedBrandEntered(addBrandFailedList, editBrandFailedList) {
    const { classNames, brandNames } = this.state;
    const failedBrandList = editBrandFailedList === undefined ?
                              addBrandFailedList :
                                editBrandFailedList;

    return failedBrandList.some(failedBrand =>
      (classNames.twName.trim() === failedBrand.class_name_zh_tw &&
      classNames.enName.trim() === failedBrand.class_name_en_us &&
      classNames.cnName.trim() === failedBrand.class_name_zh_cn) &&
      (brandNames.twName.trim() === failedBrand.brand_name_zh_tw &&
      brandNames.enName.trim() === failedBrand.brand_name_en_us &&
      brandNames.cnName.trim() === failedBrand.brand_name_zh_cn)
    );
  }

  render() {
    const { t } = this.props;
    const { addBrandFailedList, editBrandFailedList } = this.props;
    const showMemoAreaWarning = this.isEnteredBrandOriginal() ||
                                this.isFailedBrandEntered(addBrandFailedList, editBrandFailedList);

    return (
      <div styleName="form-container">
        <h2 styleName="modal-title">{this.state.isEditBrandForm ? `${t('editBrand')}` : `${t('addBrand')}`}</h2>
        <WarningArea
          addBrandFailedList={addBrandFailedList}
          editBrandFailedList={editBrandFailedList}
        />
        <TypeFields
          fieldType="class"
          hasClassNamesNotEntered={this.hasClassNamesNotEntered}
          isClassExist={this.isClassExist}
          classNames={this.state.classNames}
          basicInputProps={inputProps}
          getSuggestItems={this.getSuggestItems}
          typeTwInputChange={this.classTwInputChange}
          typeEnInputChange={this.classEnInputChange}
          typeCnInputChange={this.classCnInputChange}
          itemSelected={this.itemSelected}
          menuStyle={menuStyle}
          nonMenuStyle={nonMenuStyle}
          renderItemStyles={renderItemStyles}
        />
        <hr styleName="separate-line" />
        <TypeFields
          fieldType="brand"
          classNames={this.state.classNames}
          genBrandBoxEnabled={this.state.genBrandBoxEnabled}
          setGenBrandBox={this.setGenBrandBox}
          setStateBrandNames={this.setStateBrandNames}
          brandNames={this.state.brandNames}
          basicInputProps={inputProps}
          getSuggestItems={this.getSuggestItems}
          typeTwInputChange={this.brandTwInputChange}
          typeEnInputChange={this.brandEnInputChange}
          typeCnInputChange={this.brandCnInputChange}
          itemSelected={this.itemSelected}
          menuStyle={menuStyle}
          nonMenuStyle={nonMenuStyle}
          renderItemStyles={renderItemStyles}
        />
        <hr styleName="separate-line" />
        <MemoArea
          memoValue={this.state.memoValue}
          showMemoAreaWarning={showMemoAreaWarning}
          onMemoChange={this.handleMemoChange}
        />
        <div styleName="btn-container">
          <Button
            vdStyle="secondary"
            style={{ marginRight: '16px' }}
            onClick={this.handleCloseModal}
          >{t('cancel')}</Button>
          <Button
            vdStyle="primary"
            onClick={this.handleSubmit}
            disable={!this.isFormSubmitable(showMemoAreaWarning)}
          >{t('confirm')}</Button>
        </div>
      </div>
    );
  }
}

AddBrandForm.propTypes = {
  t: PropTypes.func,
  modelId: PropTypes.number,
  classesData: PropTypes.shape({
    1: PropTypes.shape({
      id: PropTypes.number,
      brands: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
  brandsData: PropTypes.shape({
    1: PropTypes.shape({
      id: PropTypes.number,
      vsp_id: PropTypes.string,
    }),
  }),
  classIds: PropTypes.arrayOf(PropTypes.number),
  brandIds: PropTypes.arrayOf(PropTypes.number),
  dispatchCancelModal: PropTypes.func,
  submitForm: PropTypes.func,
  addBrandFailedList: PropTypes.arrayOf(PropTypes.shape({
    vsp_id: PropTypes.string,
  })),
  clearAddFailedBrand: PropTypes.func,
  brandData: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
  closeEditBrandModal: PropTypes.func,
  editBrandFailedList: PropTypes.arrayOf(PropTypes.shape({
    vsp_id: PropTypes.string,
  })),
};

export default new translate([NAME])(CSSModules(AddBrandForm, styles));
