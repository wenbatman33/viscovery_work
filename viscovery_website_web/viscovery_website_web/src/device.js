import Cookies from 'js-cookie';
import getLang from 'utility/lang';

var localLanguage = ''; // en-us
function setLanguage(lang = "en-us") {
  try {
    lang = lang.toLowerCase()
    switch(lang){
      // case "es-es":
      // case "fr-fr":
      // case "ko-kr":
      // case "pt-pt":
      // case "de-de":
      // case "ja-jp":
      case "zh-cn":
      case "zh-tw":
        localLanguage = lang;
        break
      case "en-us":
      default:
        localLanguage = ''; // en-us
    }
  } catch(e) {}
  return localLanguage
}


let pathname = location.pathname.replace('/en-us', '').replace('/zh-cn', '').replace('/zh-tw', '');
let search = location.search;
let cookie_lang = Cookies.get('language');
if(cookie_lang === undefined) {
  setLanguage(navigator.language || navigator.userLanguage || navigator.browserLanguage);
  // setLanguage('ja-jp');
  // Cookies.set('language', localLanguage || 'en-us');

  switch(getLang()) {
    case 'en':
      if(localLanguage !== 'en-us' && localLanguage !== '') location.href = `${localLanguage}${pathname}${search}`;
      break;
    case 'zh-hans': // 簡
      if(localLanguage !== 'zh-cn') location.href = `${localLanguage}${pathname}${search}`;
      break;
    case 'zh-hant': // 繁
      if(localLanguage !== 'zh-tw') location.href = `${localLanguage}${pathname}${search}`;
      break;
  }
} else {
  let base = cookie_lang === 'en-us' ? '' : cookie_lang;
  switch(getLang()) {
    case 'en':
      if(cookie_lang !== 'en-us') location.href = `${base}${pathname}${search}`;
      break;
    case 'zh-hans': // 簡
      if(cookie_lang !== 'zh-cn') location.href = `${base}${pathname}${search}`;
      break;
    case 'zh-hant': // 繁
      if(cookie_lang !== 'zh-tw') location.href = `${base}${pathname}${search}`;
      break;
  }
  // switch(getLang()) {
  //   case 'en':
  //     Cookies.set('language', 'en-us');
  //     break;
  //   case 'zh-hans': // 簡
  //     Cookies.set('language', 'zh-cn');
  //     break;
  //   case 'zh-hant': // 繁
  //     Cookies.set('language', 'zh-tw');
  //     break;
  // }
}

let aList = document.getElementById('dropdown-box').getElementsByTagName('a');
for(let i=0; i < aList.length; i++) {
  aList[i].addEventListener("click", (event) => {
    switch(aList[i].getAttribute('href')) {
      case '/':
        Cookies.set('language', 'en-us');
        break;
      case '/zh-tw':
        Cookies.set('language', 'zh-tw');
        break;
      case '/zh-cn':
        Cookies.set('language', 'zh-cn');
        break;
    }
  });
}
