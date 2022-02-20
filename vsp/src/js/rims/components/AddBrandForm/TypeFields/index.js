import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import $ from 'jquery';
import { translate } from 'react-i18next';

import Autocomplete from 'react-autocomplete';

import { NAME } from '../../../constants';
import styles from './TypeFields.scss';

const genTypePlaceHolders = (fieldType, t) => ({
  placeholderTw: `${t('zhtw')} ${fieldType} ${t('name')}`,
  placeholderEn: `${t('enus')} ${fieldType} ${t('name')}`,
  placeholderCn: `${t('zhcn')} ${fieldType} ${t('name')}`,
});

class TypeFields extends React.Component {
  constructor(props) {
    super(props);

    this.genInputProps = this.genInputProps.bind(this);
    this.renderFieldTitle = this.renderFieldTitle.bind(this);
    this.changeGenBrandBox = this.changeGenBrandBox.bind(this);
  }

  genInputProps(fieldType, t) {
    const allInputProps = {};
    const { basicInputProps } = this.props;
    const { placeholderTw, placeholderEn, placeholderCn } = genTypePlaceHolders(fieldType, t);

    allInputProps.twInputProps = $.extend(true, {}, basicInputProps);
    allInputProps.twInputProps.placeholder = placeholderTw;

    allInputProps.enInputProps = $.extend(true, {}, basicInputProps);
    allInputProps.enInputProps.placeholder = placeholderEn;

    allInputProps.cnInputProps = $.extend(true, {}, basicInputProps);
    allInputProps.cnInputProps.placeholder = placeholderCn;

    return allInputProps;
  }

  changeGenBrandBox(event, classNames, brandNames) {
    const checked = event.target.checked;

    if (checked) {
      Object.assign(brandNames, classNames);
      this.props.setStateBrandNames(brandNames);
    }

    this.props.setGenBrandBox(checked);
  }

  // eslint-disable-next-line max-len
  renderFieldTitle(fieldType, hasClassNamesNotEntered, isClassExist, genBrandBoxEnabled, classNames, brandNames, t) {
    switch (fieldType) {
      case 'class':
        return (
          <div styleName="class-type">
            <h3>Class</h3>
            <p styleName={`${(hasClassNamesNotEntered() || isClassExist()) ? 'hide-class' : 'new-class'}`}>
              {t('newClass')}
            </p>
            <p styleName={`${(hasClassNamesNotEntered() || !isClassExist()) ? 'hide-class' : 'existed-class'}`}>
              {t('existedClass')}
            </p>
          </div>
        );
      case 'brand':
        return (
          <div styleName="brand-type">
            <h3>Brand</h3>
            <div>
              <input
                type="checkbox"
                style={{ margin: '0' }}
                checked={genBrandBoxEnabled}
                onChange={event => this.changeGenBrandBox(event, classNames, brandNames)}
              />
              <p style={{ marginLeft: '8px' }}>
                {t('noNewBrand')}
              </p>
            </div>
          </div>
        );
      default: return null;
    }
  }

  render() {
    const { t } = this.props;
    const { fieldType } = this.props;
    const { twInputProps, enInputProps, cnInputProps } = this.genInputProps(fieldType, t);

    const { hasClassNamesNotEntered, isClassExist } = this.props;
    const {
      menuStyle,
      nonMenuStyle,
      renderItemStyles,
      classNames,
      brandNames,
      getSuggestItems,
      itemSelected,
      typeTwInputChange,
      typeEnInputChange,
      typeCnInputChange,
    } = this.props;

    const stateTypeNames = fieldType === 'class' ? classNames : brandNames;

    if (this.props.genBrandBoxEnabled) {
      twInputProps.disabled = true;
      enInputProps.disabled = true;
      cnInputProps.disabled = true;
    }

    return (
      <div>
        {
          this.renderFieldTitle(
            fieldType,
            hasClassNamesNotEntered,
            isClassExist,
            this.props.genBrandBoxEnabled,
            classNames,
            brandNames,
            t
          )
        }
        <div styleName="fields-container">
          <div>
            <p>
              {t('zhtw')}*
            </p>
            <div styleName="auto-suggest-box">
              <Autocomplete
                value={stateTypeNames.twName}
                inputProps={twInputProps}
                items={getSuggestItems('tw', fieldType)}
                getItemValue={item => item.name}
                onChange={typeTwInputChange}
                onSelect={itemSelected}
                menuStyle={getSuggestItems('tw', fieldType).length > 0 ? menuStyle : nonMenuStyle}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={isHighlighted ? renderItemStyles.highlightedItem : renderItemStyles.item}
                    key={item.index}
                  >{item.name}</div>
                )}
              />
            </div>
          </div>
          <div>
            <p>
              {t('enus')}*
            </p>
            <div styleName="auto-suggest-box">
              <Autocomplete
                value={stateTypeNames.enName}
                inputProps={enInputProps}
                items={getSuggestItems('en', fieldType)}
                getItemValue={item => item.name}
                onChange={typeEnInputChange}
                onSelect={itemSelected}
                menuStyle={getSuggestItems('en', fieldType).length > 0 ? menuStyle : nonMenuStyle}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={isHighlighted ? renderItemStyles.highlightedItem : renderItemStyles.item}
                    key={item.index}
                  >{item.name}</div>
                )}
              />
            </div>
            <small styleName={`${stateTypeNames.enName.indexOf('-') > -1 ? 'show-validation' : 'hide-validation'}`}>
              {t('noHyphenInBrand')}
            </small>
          </div>
          <div>
            <p>
              {t('zhcn')}*
            </p>
            <div styleName="auto-suggest-box">
              <Autocomplete
                value={stateTypeNames.cnName}
                inputProps={cnInputProps}
                items={getSuggestItems('cn', fieldType)}
                getItemValue={item => item.name}
                onChange={typeCnInputChange}
                onSelect={itemSelected}
                menuStyle={getSuggestItems('cn', fieldType).length > 0 ? menuStyle : nonMenuStyle}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={isHighlighted ? renderItemStyles.highlightedItem : renderItemStyles.item}
                    key={item.index}
                  >{item.name}</div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TypeFields.propTypes = {
  t: PropTypes.func,
  fieldType: PropTypes.string,
  menuStyle: PropTypes.shape({
    overflowY: PropTypes.string,
  }),
  nonMenuStyle: PropTypes.shape({
    overflowY: PropTypes.string,
  }),
  renderItemStyles: PropTypes.shape({
    item: PropTypes.shape({
      cursor: PropTypes.string,
    }),
    highlightedItem: PropTypes.shape({
      cursor: PropTypes.string,
    }),
  }),
  basicInputProps: PropTypes.shape({
    placeholder: PropTypes.string,
  }),
  classNames: PropTypes.shape({
    classTwName: PropTypes.string,
  }),
  brandNames: PropTypes.shape({
    brandTwName: PropTypes.string,
  }),
  getSuggestItems: PropTypes.func,
  itemSelected: PropTypes.func,
  typeTwInputChange: PropTypes.func,
  typeEnInputChange: PropTypes.func,
  typeCnInputChange: PropTypes.func,
  hasClassNamesNotEntered: PropTypes.func,
  isClassExist: PropTypes.func,
  genBrandBoxEnabled: PropTypes.bool,
  setGenBrandBox: PropTypes.func,
  setStateBrandNames: PropTypes.func,
};

export default new translate([NAME])(CSSModules(TypeFields, styles));
