import { addClass, removeClass } from 'utility/IE8ClassList';

class SolutionSubMenu {

  menuOpen = false;
  target = document.getElementById('solutionSubMenu');
  mobileMenu = document.getElementById('solutionSubMenu').getElementsByClassName('solution-main__mobile-menu__txt')[0];
  solutionMenu = document.getElementById('solutionSubMenu').getElementsByClassName('solution-main__menu')[0];

  constructor() {
    this.menuOpenHandler = this.menuOpenHandler.bind(this)
    this.onTouchBody = this.onTouchBody.bind(this);

    this.mobileMenu.addEventListener('click', this.menuOpenHandler, false);
    let dataSelect = parseInt(this.target.getAttribute('data-select')) - 1;
    addClass(this.solutionMenu.getElementsByTagName('a')[dataSelect], 'solution-main__menu__nav--on');
    let focusMenuText = this.solutionMenu.getElementsByTagName('a')[dataSelect].text;
    this.mobileMenu.innerHTML = focusMenuText;
  }

  menuOpenHandler(){
    if(this.menuOpen === true){
      this.menuOpen = false;
      addClass(this.solutionMenu, 'solution-main__menu--hide');
      document.body.removeEventListener("touchstart", this.onTouchBody);
    }else{
      this.menuOpen = true;
      removeClass(this.solutionMenu, 'solution-main__menu--hide');
      document.body.addEventListener("touchstart", this.onTouchBody, false);
    }
  }

  checkInsideDOM(target) {
		return this.target === target ? true : target === null ? false : this.checkInsideDOM(target.parentNode);
	}

  onTouchBody(event) {
		if(!this.checkInsideDOM(event.target)) {
      this.menuOpen = false;
      addClass(this.solutionMenu, 'solution-main__menu--hide');
      document.body.removeEventListener("touchstart", this.onTouchBody)
		}
	}
}

new SolutionSubMenu();
