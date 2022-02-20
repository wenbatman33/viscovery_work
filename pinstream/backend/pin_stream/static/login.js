/// <reference path="utilities.js" />

var PinstreamWeb = {
    info: {
        isExtension: false,
        clientIdName: 'source_id'
    },
    init: function (isExtension) {
        PinstreamWeb.info.isExtension = isExtension

        if (PinstreamUtilitiesWeb.uid()) {
            PinstreamWeb.RedirectToMamagement(PinstreamWeb.info.isExtension == 'True');
        }

        window.fbAsyncInit = function () {
            FB.init({
                appId: '1128854430548522',
                xfbml: true,
                version: 'v2.9'
            });
            FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, login: function () {
        var form = document.getElementById('form-login')

        if (!form || !form.length) {
            return;
        }

        var errorArea = document.getElementById('error-area')
        errorArea.className = "displaynone"
        //todo browser
        var formData = new FormData(form);

        for (var i = 0; i < form.length; i++) {
            var element = form[i];
            formData.append(element.id, element.value);
        }

        formData.append(PinstreamWeb.info.clientIdName, PinstreamUtilitiesWeb.clientId);

        var oReq = new XMLHttpRequest();

        oReq.onreadystatechange = function () {
            if (oReq.readyState == 4 && oReq.status == 200) {
                if (!PinstreamWeb.OnRedirectToMamagement(oReq.responseText)) {
                    var errorArea = document.getElementById('error-area')
                    errorArea.className = "displayblock"
                }
            }
        }
        oReq.open("POST", "/api/v1/login/email");
        oReq.send(formData);
    },
    RedirectToMamagement: function (is_extension) {
        if (is_extension) {
            window.location.href = '/u/success';
        } else {
            window.location.href = '/u/mamagement';
        }
    }, CheckLogin: function () {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                console.log('Logged in.');
                PinstreamWeb.GetFbInfo()
            } else {
                //todo browser block popup
                //maybe redirect login page not use button
                //FbLogin();
            }
        });
    }, GetFbInfo: function () {
        FB.api('/me', 'GET', { "fields": "id,name,email,birthday" },
            function (response) {
                if (response.id && response.email, response.birthday) {
                    var params = "id=" + response.id + "&email=" + response.email + "&birthday=" + response.birthday + "&" + PinstreamWeb.info.clientIdName + "=" + PinstreamUtilitiesWeb.clientId;
                    PinstreamWeb.Enroll(params);
                }
            }
        );
    }, Enroll: function (params) {
        var oReq = new XMLHttpRequest();
        oReq.onreadystatechange = function () {
            if (oReq.readyState == 4 && oReq.status == 200) {
                PinstreamWeb.OnRedirectToMamagement(oReq.responseText)
            }
            console.info('Server error')
        };
        oReq.open("POST", "/api/v1/enroll", true);
        oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        oReq.setRequestHeader("cache-control", "no-cache");
        oReq.send(params);
    }, OnRedirectToMamagement: function (responseText) {
        if (responseText) {
            var data = JSON.parse(responseText)
            if (data && data.isSuccess) {
                PinstreamUtilitiesWeb.setTokenInfoTolocalStorage(data)
                PinstreamWeb.RedirectToMamagement(PinstreamWeb.info.isExtension == 'True');
                return true;
            }
        }
        return false;
    }
}
