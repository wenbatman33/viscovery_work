import { addClass, removeClass } from 'utility/IE8ClassList'
import getLang from 'utility/lang'


class Header {

  langMenuOpen    = false;

  menuBlock       = document.getElementById('menu-block');
  dropdownBtn     = document.getElementById('dropdown-btn');
  selectLang      = document.getElementById('select-lang');
  dropdownBox     = document.getElementById('dropdown-box');
  mainMenu        = document.getElementById('main-menu');
  mobileMenuClose = document.getElementById('mobile-menu-close');
  mobileMenuOpen  = document.getElementById('mobile-menu-open');


  constructor() {
    this.menuOpenHandler = this.menuOpenHandler.bind(this)
    this.menuCloseHandler = this.menuCloseHandler.bind(this)
    this.lanMenuOpenHandler = this.lanMenuOpenHandler.bind(this)
    this.onTouchBody = this.onTouchBody.bind(this);
    this.checkInsideDOM = this.checkInsideDOM.bind(this);

    this.mobileMenuClose.addEventListener("click", this.menuCloseHandler, false);
    this.mobileMenuOpen.addEventListener("click", this.menuOpenHandler, false);
    this.dropdownBtn.addEventListener("click", this.lanMenuOpenHandler, false);

    let lang = getLang();
    removeClass(this.dropdownBox.getElementsByTagName('a')[0], 'lang-menu__nav--on');
    removeClass(this.dropdownBox.getElementsByTagName('a')[1], 'lang-menu__nav--on');
    removeClass(this.dropdownBox.getElementsByTagName('a')[2], 'lang-menu__nav--on');
    switch(lang) {
      case 'zh-hans': // 簡中
        this.selectLang.innerHTML = '简体中文';
        addClass(this.dropdownBox.getElementsByTagName('a')[2], 'lang-menu__nav--on');
        break
      case 'zh-hant': // 繁中
        this.selectLang.innerHTML = '繁體中文';
        addClass(this.dropdownBox.getElementsByTagName('a')[1], 'lang-menu__nav--on');
        break
      case 'en':
      default:
        this.selectLang.innerHTML = 'EN';
        addClass(this.dropdownBox.getElementsByTagName('a')[0], 'lang-menu__nav--on');
    }

    let page = document.documentElement.getAttribute('data-page');
    if(page.indexOf('solution') === 0) page = 'solution';

    let focueMenu;
    switch(page) {
      case 'core':
        addClass(this.mainMenu.getElementsByTagName('a')[0], 'main-menu__nav--on');
        break;
      case 'solution':
        addClass(this.mainMenu.getElementsByTagName('a')[1], 'main-menu__nav--on');
        break;
      case 'news-article':
      case 'news':
        addClass(this.mainMenu.getElementsByTagName('a')[2], 'main-menu__nav--on');
        break;
      case 'about':
        addClass(this.mainMenu.getElementsByTagName('a')[3], 'main-menu__nav--on');
        break;
    }

  }

  menuOpenHandler() {
    removeClass(this.menuBlock, 'visc-header__menu-block--hide');
    removeClass(this.mobileMenuClose, 'mobile-btn-close--hide');
    addClass(this.mobileMenuOpen, 'mobile-menu--hide');
  }

  menuCloseHandler() {
    addClass(this.menuBlock, 'visc-header__menu-block--hide');
    addClass(this.mobileMenuClose, 'mobile-btn-close--hide');
    removeClass(this.mobileMenuOpen, 'mobile-menu--hide');
  }

  lanMenuOpenHandler() {
    if(this.langMenuOpen === true){
      this.langMenuOpen = false;
      document.body.removeEventListener("touchstart", this.onTouchBody);
    }else{
      this.langMenuOpen = true;
      console.log('-----')
      document.body.addEventListener("touchstart", this.onTouchBody, false);
    }
    this.render();
  }

  checkInsideDOM(target) {
		return this.dropdownBox === target || this.dropdownBtn === target ? true : target === null ? false : this.checkInsideDOM(target.parentNode);
	}

  onTouchBody(event) {
    console.log(event)
		if(!this.checkInsideDOM(event.target)) {
      this.langMenuOpen = false;
      document.body.removeEventListener("touchstart", this.onTouchBody);
      this.render();
		}
	}

  render() {
    if(this.langMenuOpen) {
      addClass(this.dropdownBtn, 'lan-select--open');
      removeClass(this.dropdownBox, 'lang-menu--hide');
      removeClass(this.mainMenu, 'main-menu--hide');
    } else {
      removeClass(this.dropdownBtn, 'lan-select--open');
      addClass(this.dropdownBox, 'lang-menu--hide');
      addClass(this.mainMenu, 'main-menu--hide');
    }
  }

}

new Header();
