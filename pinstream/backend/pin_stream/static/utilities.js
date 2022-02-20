var PinstreamUtilitiesWeb = {
    keys: ['uid', 'token', 'refresh_token', 'expires_in', 'source_id'],
    clientId: '251406c814554f7ca509545b78ae9578',
    uid: function () {
        return PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[0])
    },
    isExpires: function (expiresin) {
        var info = PinstreamUtilitiesWeb.getTokenInfofromlocalStorage();
        if (!info) { return true; }
        var dtNow = Math.floor(Date.now() / 1000);
        return ((parseInt(info[PinstreamUtilitiesWeb.keys[3]]) || 0) - dtNow <= 300);
    },
    setTokenInfoTolocalStorage: function (info) {
        PinstreamUtilitiesWeb.localStorageSetIem(PinstreamUtilitiesWeb.keys[0], info[PinstreamUtilitiesWeb.keys[0]])
        PinstreamUtilitiesWeb.localStorageSetIem(PinstreamUtilitiesWeb.keys[1], info[PinstreamUtilitiesWeb.keys[1]])
        PinstreamUtilitiesWeb.localStorageSetIem(PinstreamUtilitiesWeb.keys[2], info[PinstreamUtilitiesWeb.keys[2]])
        PinstreamUtilitiesWeb.localStorageSetIem(PinstreamUtilitiesWeb.keys[3], info[PinstreamUtilitiesWeb.keys[3]])
    },
    getTokenInfofromlocalStorage: function () {
        var info = {}
        info[PinstreamUtilitiesWeb.keys[0]] = PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[0]);
        info[PinstreamUtilitiesWeb.keys[1]] = PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[1]);
        info[PinstreamUtilitiesWeb.keys[2]] = PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[2]);
        info[PinstreamUtilitiesWeb.keys[3]] = PinstreamUtilitiesWeb.localStorageGetIem(PinstreamUtilitiesWeb.keys[3]);
        return info;
    },
    removeTokenInfoTolocalStorage: function () {
        PinstreamUtilitiesWeb.localStorageRemoveIem(PinstreamUtilitiesWeb.keys[0]);
        PinstreamUtilitiesWeb.localStorageRemoveIem(PinstreamUtilitiesWeb.keys[1]);
        PinstreamUtilitiesWeb.localStorageRemoveIem(PinstreamUtilitiesWeb.keys[2]);
        PinstreamUtilitiesWeb.localStorageRemoveIem(PinstreamUtilitiesWeb.keys[3]);
    },
    localStorageGetIem: function (key) {
        return localStorage.getItem(key)
    },
    localStorageSetIem: function (key, value) {
        return localStorage.setItem(key, value)
    },
    localStorageRemoveIem: function (key) {
        return localStorage.removeItem(key)
    },
    merge: function (obj1, obj2) {
        var merged = {};
        for (key in obj1)
            merged[key] = obj1[key];
        for (key in obj2)
            merged[key] = obj2[key];
        return merged;
    },
    updatetoken: function (callback) {
        var info = PinstreamUtilitiesWeb.getTokenInfofromlocalStorage();

        var data = PinstreamUtilitiesWeb.keys[0] + "=" + info[PinstreamUtilitiesWeb.keys[0]] + "&" + PinstreamUtilitiesWeb.keys[2] + "=" + info[PinstreamUtilitiesWeb.keys[2]] + "&" + PinstreamUtilitiesWeb.keys[3] + "=" + info[PinstreamUtilitiesWeb.keys[3]] + "&" + PinstreamUtilitiesWeb.keys[4] + "=" + PinstreamUtilitiesWeb.clientId;
        // `${PinstreamUtilitiesWeb.keys[0]}=${info[PinstreamUtilitiesWeb.keys[0]]}&${PinstreamUtilitiesWeb.keys[2]}=${info[PinstreamUtilitiesWeb.keys[2]]}&${PinstreamUtilitiesWeb.keys[3]}=${info[PinstreamUtilitiesWeb.keys[3]]}&${PinstreamUtilitiesWeb.keys[4]}=${PinstreamUtilitiesWeb.clientId}`;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var data = JSON.parse(this.responseText)
                if (data && data.isSuccess) {
                    PinstreamUtilitiesWeb.setTokenInfoTolocalStorage(data)
                }
                callback(data)
            }
        });

        xhr.open("POST", "https://leejulee.pythonanywhere.com/api/v1/token");
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("authorization", "Token " + info[PinstreamUtilitiesWeb.keys[1]]);
        //xhr.setRequestHeader("authorization", "Token dJoZXYVOnxaER5N0kOvaANL1jW864w0q");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);
    }
}