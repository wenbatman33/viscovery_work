import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';
import { translate } from 'react-i18next';

import styles from './Navbar.scss';

import MainLinkContainer from '../../containers/MainLinkContainer';
import RegularLink from './RegularLink';
import Dropdown from './Dropdown';
import AuthMenu from './AuthMenu';
import I18nSelector from './I18nSelector';
import HrsAdminDropdownMenu from './HrsAdminDropdownMenu';
import { NAME } from '../../constants';

import {
  handlePathname,
} from './MainLink';

import LOGO_URL from '../../../../asset/logo.svg';

const linkTo = to => () => {
  routerUtil.pushHistory(to);
};

const localeMapping = {
  zhtw: '繁',
  zhcn: '簡',
  enus: 'EN',
};

const getLocaleMapping = (localeMap, defaultLocale = 'enus') => locale =>
  localeMap[locale] || localeMap[defaultLocale];

const getInitial = str => (str ? str[0].toUpperCase() : null);

const usernameColorMapping = (str) => {
  if (!str) return 'auto';
  const mapping = [
    '#E24522',
    '#EB5757',
    '#A5DC67',
    '#17ABFF',
    '#25DDBA',
    '#FFD82B',
    '#B16DFF',
  ];

  return mapping[(str.charCodeAt(2) || 0 + new Date().getDay()) % 7];
};

const isHrsMember = permissions => permissions.includes('/hrs/dispatch') && !permissions.includes('/hrs/admin');
const isHrsAdmin = permissions => permissions.includes('/hrs/admin');


class Navbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getHrsLink = this.getHrsLink.bind(this);
  }

  getHrsLink(permissions) {
    if (isHrsMember(permissions)) {
      return (
        <MainLinkContainer
          title="HRS"
          to="/hrs/dispatch"
          active
          style={{
            marginRight: '30px',
          }}
        />
      );
    }

    if (isHrsAdmin(permissions)) {
      return (
        <Dropdown
          style={{
            display: 'inline-block',
            height: '100%',
            marginRight: '30px',
          }}
          dropdownMenu={(
            <HrsAdminDropdownMenu permissions={permissions} />
          )}
        >
          <div>
            <p
              style={{
                color: handlePathname('/hrs')(this.props.pathname) ? '#E24522' : null,
              }}
            >
              HRS
            </p>
          </div>
        </Dropdown>
      );
    }

    return (
      // <MainLinkContainer
      //   title="HRS"
      //   to="/hrs/admin"
      //   active
      //   style={{
      //     marginRight: '30px',
      //   }}
      // />
      null
    );
  }

  render() {
    const { t } = this.props;
    return (
      <nav
        styleName="container"
        role="navigation"
      >
        <div
          style={{
            marginRight: '115px',
          }}
        >
          <a href="/#">
            <img
              height="100%"
              src={LOGO_URL}
              alt={'Preview'}
            />
          </a>
        </div>
        <ul
          styleName="left"
        >
          <MainLinkContainer
            title={t('cms')}
            to="/cms"
            style={{
              marginRight: '30px',
            }}
          />
          <MainLinkContainer
            title={t('tag2ad')}
            to="/tag2ad"
            style={{
              marginRight: '30px',
            }}
          />
          {
            this.getHrsLink(this.props.permissions)
          }
          <MainLinkContainer
            title={t('admin')}
            to="/admin"
            style={{
              marginRight: '30px',
            }}
          />
          <MainLinkContainer
            title={t('report')}
            to="/report"
            style={{
              marginRight: '30px',
            }}
          />
          <MainLinkContainer
            title={t('system')}
            to="/system"
            style={{
              marginRight: '30px',
            }}
          />
          <MainLinkContainer
            title={t('rims')}
            to="/rims"
            style={{
              marginRight: '30px',
            }}
          />
        </ul>
        <div styleName="right">
          {
            this.props.active && this.props.permissions.length > 0 ?
              <div
                styleName="right-container"
              >
                <Dropdown
                  style={{
                    marginRight: '30px',
                  }}
                  dropdownMenu={(
                    <AuthMenu
                      username={this.props.username}
                      groupName={this.props.groupName}
                      roleName={this.props.roleName}
                      logout={this.props.logout}
                    />
                  )}
                >
                  <div
                    styleName="username"
                    style={{
                      background: usernameColorMapping(this.props.username),
                    }}
                  >
                    <p>
                      {getInitial(this.props.username)}
                    </p>
                  </div>
                </Dropdown>
                {
                  <Dropdown
                    dropdownMenu={(
                      <I18nSelector
                        changeLocale={this.props.changeLocale}
                      />
                    )}
                  >
                    <div styleName="locale__selector">
                      <p
                        style={{
                          marginRight: '7px',
                        }}
                      >
                        {getLocaleMapping(localeMapping)(this.props.locale)}
                      </p>
                    </div>
                  </Dropdown>
                }
              </div>
            :
              <RegularLink
                title={t('login')}
                onClick={linkTo('/auth/signin')}
                style={{
                  marginRight: '20px',
                }}
              />
          }
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  username: PropTypes.string,
  groupName: PropTypes.string,
  roleName: PropTypes.string,
  pathname: PropTypes.string,
  onSelect: PropTypes.func,
  onLangSelect: PropTypes.func,
  active: PropTypes.bool,
  permissions: PropTypes.arrayOf(PropTypes.string),
  logout: PropTypes.func,
  changeLocale: PropTypes.func,
  locale: PropTypes.string,
  t: PropTypes.func,
};

export default new translate([NAME])(CSSModules(Navbar, styles));
