/**
 * Created by amdis on 2017/3/27.
 */
import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import AdFormDropDown from '../../components/AdFormDropDown';
import * as helper from '../../components/AdFormDropDown/helper';
import AdForm from '../../models/AdForm';

describe('AdFormDropDown', () => {
  const forms = [
    new AdForm(
      {
        duration: 20,
        height: 250,
        id: 1,
        name: 'cornor1',
        name_zh_cn: '角标1',
        name_zh_tw: '角標1',
        type: 1,
        width: 300,
      }
    ),
    new AdForm(
      {
        duration: 20,
        height: 280,
        id: 2,
        name: 'cornor2',
        name_zh_cn: '角标2',
        name_zh_tw: '角標2',
        type: 1,
        width: 336,
      }
    ),
  ];

  const dropDownOptions = [
    {
      label: '角標1',
      value: 1,
    },
    {
      label: '角標2',
      value: 2,
    },
  ];

  describe('helper', () => {
    it('Model to dropdown list options', () => {
      const options = helper.toDropDownOptions(forms);
      options.forEach((option, index) => {
        expect(option).to.eql(dropDownOptions[index]);
      });
    });
  });

  describe('component', () => {
    it('must render', () => {
      const component = shallow(<AdFormDropDown adForms={forms} />);
      expect(component).to.not.equal(null);
    });
  });
});
