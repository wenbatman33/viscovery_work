export default function getLang() {
  let lang = document.documentElement.getAttribute('lang');
  lang = lang === null ? '' : lang.toLowerCase();
  switch(lang) {
    case 'zh-hans': // 簡中
    case 'zh-hant': // 繁中
    case 'en':
      break;
    default:
      lang = 'en';
  }
  return lang;
}
