(function () {
    'use strict';
    document.onreadystatechange = function () {
        var state = document.readyState;
        if (state === 'interactive') {

            var r = document.createElement('script');
            r.src = chrome.extension.getURL('content/react.min.js');// 'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react.min.js';
            r.type = 'text/javascript';
            r.async = false;
            (document.head || document.documentElement).appendChild(r);

            var r_dom = document.createElement('script');
            r_dom.src = chrome.extension.getURL('content/react-dom.min.js');//'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom.min.js';
            r_dom.type = 'text/javascript';
            r_dom.async = false;
            (document.head || document.documentElement).appendChild(r_dom);

            var css = document.createElement('link')
            css.href = chrome.extension.getURL('content.css');
            (document.head || document.documentElement).appendChild(css);

            var s = document.createElement('script')
            s.src = chrome.extension.getURL('content/dailymotion.js');
            r.async = false;
            (document.head || document.documentElement).appendChild(s);

            localStorage.setItem('imgurl', chrome.extension.getURL("icon/pin_Icon_32x32.png"));
            
            // console.info('run load react')
        }
    }
})();