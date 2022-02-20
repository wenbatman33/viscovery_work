import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import { translate } from 'react-i18next';

import { NAME } from '../constants';
import { LOCALE_ZH_CN, LOCALE_ZH_TW } from '../../app/constants';

import styles from '../styles/groupSelect.scss';

const transOptions = (choices, groups, roles, locale) =>
  Object.keys(choices).map((key) => {
    const group = groups.filter(g => g.id === Number(key));
    const role = roles.filter(r => r.id === choices[key].role_id);
    const roleName = (locale === LOCALE_ZH_TW && role[0].name_zh_tw)
      || (locale === LOCALE_ZH_CN && role[0].name_zh_cn)
      || role[0].name;
    return {
      group_id: key,
      role_id: choices[key].role_id,
      group_name: group[0].name,
      role_name: roleName,
      valid: choices[key].valid,
    };
  });

class GroupSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      selected: -1,
    };

    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  componentDidMount() {
    this.props.getGroups();
    this.props.getRoles();
    this.props.getChoices();
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.choices).length !== 0 && nextProps.groups.length !== 0
        && nextProps.roles.length !== 0) {
      const options =
        transOptions(nextProps.choices, nextProps.groups, nextProps.roles, nextProps.locale);
      this.setState({ options });
    }
  }

  handleSelectGroup(selected, groupId, roleId) {
    this.props.patchRole(groupId, roleId);
    this.setState({ selected });
  }

  render() {
    const { t } = this.props;
    return (
      <div styleName="container">
        <div styleName="titleRow">
          <h2>{t('rolePrompt')}</h2>
        </div>
        <div styleName="optContainer">
          {this.state.options.map((opt, idx) => (
            <div
              styleName={opt.valid === 0 ? 'selectedRow' : 'row'}
              key={idx}
              onClick={() => (
                (opt.valid === 1)
                ? this.handleSelectGroup(idx, opt.group_id, opt.role_id)
                : null)
              }
            >
              <div styleName="groupWording">
                <p>{opt.group_name}</p>
              </div>
              <div styleName="roleWording">
                <p>{opt.role_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

GroupSelect.propTypes = {
  getGroups: PropTypes.func,
  getRoles: PropTypes.func,
  getChoices: PropTypes.func,
  patchRole: PropTypes.func,
  t: PropTypes.func,
  groups: PropTypes.arrayOf(PropTypes.object),
  roles: PropTypes.arrayOf(PropTypes.object),
  locale: PropTypes.string,
  choices: PropTypes.object,
};

export default translate([NAME])(CSSModules(GroupSelect, styles));
