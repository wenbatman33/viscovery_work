const { PinstreamUtilitiesWeb } = require('utilities');
/*global FB*/
const PinstreamWeb = {
  info: {
    isExtension: false,
    clientIdName: 'source_id'
  },
  fbinit: () => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '1128854430548522',
        xfbml: true,
        version: 'v2.9'
      });
      FB.AppEvents.logPageView();
    };
    (function (d, s, id) {
      let js = null;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  },
  init: (isExtension) => {
    PinstreamWeb.info.isExtension = isExtension;

    if (PinstreamUtilitiesWeb.uid()) {
      PinstreamWeb.RedirectToMamagement(PinstreamWeb.info.isExtension === 'True');
    }

    PinstreamWeb.fbinit();


  },
  login: (email, password) => {
    // const errorArea = document.getElementById('error-area');
    // errorArea.className = 'displaynone';
    //todo browser
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append(PinstreamWeb.info.clientIdName, PinstreamUtilitiesWeb.clientId);

    const oReq = new XMLHttpRequest();

    oReq.onreadystatechange = function () {
      if (oReq.readyState === 4 && oReq.status === 200) {
        if (!PinstreamWeb.OnRedirectToMamagement(oReq.responseText)) {
          console.info('error');
          // const errorarea = document.getElementById('error-area');
          // errorarea.className = 'displayblock';
        }
      }
    };
    oReq.open('POST', '/api/v1/login/email');
    oReq.send(formData);
  },
  RedirectToMamagement: (isExtension) => {
    if (isExtension) {
      window.location.href = '/u/success';
    } else {
      window.location.href = '/u/mamagement';
    }
  },
  CheckLogin: () => {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log('Logged in.');
        PinstreamWeb.GetFbInfo();
      } else {
        //todo browser block popup
        //maybe redirect login page not use button
        //FbLogin();
      }
    });
  },
  GetFbInfo: () => {
    FB.api('/me', 'GET', { fields: 'id,name,email,birthday' },
      (response) => {
        if (response.id && response.email && response.birthday) {
          const params = `id=${response.id}&email=${response.email}&birthday=${response.birthday}&${PinstreamWeb.info.clientIdName}=${PinstreamUtilitiesWeb.clientId}`;
          PinstreamWeb.Enroll(params);
        } else if (response.id) {
          FB.api(`/${response.id}/permissions`, 'DELETE', {}, rs => console.info(rs));
        } else {
          console.info(response);
        }
      }
    );
  },
  Enroll: (params) => {
    const oReq = new XMLHttpRequest();
    oReq.onreadystatechange = () => {
      if (oReq.readyState === 4 && oReq.status === 200) {
        PinstreamWeb.OnRedirectToMamagement(oReq.responseText);
      }
      console.info('Server error');
    };
    oReq.open('POST', '/api/v1/enroll', true);
    oReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    oReq.setRequestHeader('cache-control', 'no-cache');
    oReq.send(params);
  },
  OnRedirectToMamagement: (responseText) => {
    if (responseText) {
      const data = JSON.parse(responseText);
      if (data && data.isSuccess) {
        PinstreamUtilitiesWeb.setTokenInfoTolocalStorage(data);
        PinstreamWeb.RedirectToMamagement(PinstreamWeb.info.isExtension === 'True');
        return true;
      }
    }
    return false;
  }
};

exports.PinstreamWeb = PinstreamWeb;
