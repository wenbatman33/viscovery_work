function addNotifyCorner() {
  // add notifyCornerDIV start by batman
  var NC = document.createElement("div");
  NC.id = "notifyCorner";
  var notifyCornerStyle = "position:fixed;width:200px;height:90%;top:10px;right:10px;z-index:999999;pointer-events:none";
  NC.style.cssText = notifyCornerStyle;
  document.body.appendChild(NC);
  // add notifyCornerDIV end by batman
}
function CreateMutationObs(e) {
  if (this._target = e.target, !this._target) throw "_target undefined";
  if (this._observerCallBack = function (e) {
    console.info(e)
  }, this._observer = new MutationObserver(function (e) {
    this._observerCallBack(e)
  }.bind(this)), !e.type) throw "type undefined";
  switch (e.type) {
    case pinstream.MutationObsType.attrStyle:
      this._config = {
        attributes: !0,   
        attributeFilter: ["style"]
      };
      break;
    case pinstream.MutationObsType.childList:
      this._config = {
        childList: !0
      };
      break;
    case pinstream.MutationObsType.customChange:
      this._config = e.config;
      break;
    default:
      throw "_config undefined"
  }
  this.run = function () {
    this._observer.observe(this._target, this._config)
  }, this.close = function () {
    this._observer.disconnect()
  }
}

function CreatePinButton(e, t, i) {
  var n = document.createElement("button");
  return n.className = "pin-button", n.title = e, n.dataset.url = e, n.dataset.vid = t, n.addEventListener("click", function (e) {
    e.preventDefault(), e.stopPropagation(), e.cancelBubble = !0;
    var t = this.dataset.url,
      n = this.dataset.vid;
    switch (i) {
      case pinstream.WebSiteName.vimeo:
        pinstream.OnSaveVimeoInfo(t, n);
        break;
      case pinstream.WebSiteName.fb:
        pinstream.OnSaveFbInfo(t, n, !1);
        break;
      default:
        console.info("CreateButton not found type")
    }
    console.info(t)
  }), n
}
function savingLayer(str) {
  var notifyItem = document.createElement("div");
  var textMSG = document.createTextNode(str);
  var notifyItemStyle = "display:block;width:200px;height:40px;line-height:40px;";
  notifyItemStyle += "margin:5px;color:rgb(255, 255, 255);opacity:1;font-size:14px;text-align:center;border-radius:8px;";
  notifyItemStyle += "box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 4px 0px;transition: all 0.3s;"
  if (str === "Fail!"){
    notifyItemStyle += "background:-webkit-linear-gradient(-120deg, #FF7777 0%, #DA0021 100%);";
  } else if (str === "Success!" || str ==="existed"){
    notifyItemStyle += "background:-webkit-linear-gradient(-120deg, #B4EC51 0%, #429321 100%);";
  }else{
    notifyItemStyle += "background:-webkit-linear-gradient(-120deg, #44A3D9 0%, #2A2FBF 100%);";
  }


  notifyItem.style.cssText = notifyItemStyle;
  notifyItem.appendChild(textMSG);
  document.getElementById("notifyCorner").appendChild(notifyItem);
  (str === "Video Saving" ? setTimeout(removeNotifyItem, 500) : setTimeout(removeNotifyItem, 3000))
}

function removeNotifyItem() {
  var RNI = document.getElementById("notifyCorner");
  RNI.removeChild(RNI.childNodes[0]);
}


var pinstream = {
  ServerHost: "https://pinstream.viscovery.com",
  ManagementUrl: function () {
    return pinstream.ServerHost + "/VideoList"
  },
  MutationObsType: {
    attrStyle: "attr-style",
    childList: "child",
    customChange: "c"
  },
  WebSiteName: {
    fb: "facebook",
    youtube: "youtube",
    dailymotion: "dailymotion",
    vimeo: "vimeo"
  },
  PinBtnCSSName: ".pin-button",
  GetEmbedUrl: function (e, t) {
    switch (e) {
      case pinstream.WebSiteName.fb:
        return pinstream.GetFbUrlById(t);
      case pinstream.WebSiteName.youtube:
        return pinstream.GetYoutuBeUrlById(t);
      case pinstream.WebSiteName.dailymotion:
        return pinstream.GetDailyMotionUrlById(t);
      case pinstream.WebSiteName.vimeo:
        return pinstream.GetVimeoUrlById(t)
    }
  },
  GetYoutuBeUrlById: function (e) {
    return "https://www.youtube.com/watch?v=" + e
  },
  GetDailyMotionUrlById: function (e) {
    return "https://www.dailymotion.com/embed/video/" + e
  },
  GetVimeoUrlById: function (e) {
    return "https://player.vimeo.com/video/" + e + "/"
  },
  GetFbUrlById: function (e) {
    return "https://www.facebook.com/facebook/videos/" + e + "/"
  },
  RegexYoutubeWithViemo: function (e) {
    var t = new RegExp(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
    return t.exec(e)
  },
  OnNotifications: function (e) {
    if (e && e.type && e.msg) switch (e.type) {
      case 1:
        chrome.notifications.create("xxxx", {
          iconUrl: chrome.runtime.getURL("icon/unsaved_48.png"),
          title: "Saving......",
          type: "basic",
          message: e.msg,
          buttons: [{
            title: "Learn More"
          }],
          isClickable: !1,
          priority: 0
        }, function () { });
        break;
      case 2:
      case 3:
      case 4:
        chrome.notifications.getAll(function (t) {
          var i = {
            iconUrl: chrome.runtime.getURL("icon/saved_48.png"),
            title: "Success",
            type: "basic",
            message: e.msg,
            buttons: [{
              title: "Learn More"
            }],
            isClickable: !1,
            priority: 0
          };
          t.hasOwnProperty("xxxx") ? chrome.notifications.update("xxxx", i, function () { }) : chrome.notifications.create("xxxx", i, function () { })
        })
    }
  },
  SnedMsg: function (e, t) {
    e && !t ? chrome.runtime.sendMessage(e, function (e) { }) : e && t && pinstream.OnNotifications(e)
  },
  OnSaveYoutubeInfo: function (e, t) {
    pinstream.CheckLogIn(function (i) {
      var n = "https://youtube.com/oembed?url=" + encodeURIComponent(e) + "&format=json",
        o = new XMLHttpRequest;
      o.open("get", n, !0), o.onreadystatechange = function () {
        if (o.DONE === o.readyState)
          if (200 == o.status) {
            var e = JSON.parse(o.responseText),
              n = document.createElement("div");
            if (n.innerHTML = e.html, n.children && n.children[0].src) {
              var s = n.children[0].src,
                r = pinstream.RegexYoutubeWithViemo(s),
                a = r && r.length > 6 ? r[6] : "";
              return void pinstream.SaveVideoToServer({
                webSite: 1,
                videoId: a,
                videoUrl: s,
                title: e.title,
                imgurl: "https://i.ytimg.com/vi/" + a + "/hqdefault.jpg"
              }, t, i)
            }
          } else {
            savingLayer("Fail!");
          }
      }, o.send(), savingLayer("Video Saving")
    })
  },
  OnSaveFbInfo: function (e, t, i) {
    pinstream.CheckLogIn(function (n) {
      if (e.indexOf("facebook") != -1) {
        var o = "1128854430548522|2327c5584a1cb25e8ea3f6f96c5c2dd3",
          s = /(https|http):\/\/www.facebook.com\/+.*\/videos\/(\d+)/i,
          r = s.exec(e);
        if (t = t || r.length > 0 && r[2] ? r[2] : t, !t) return;
        var a = "https://graph.facebook.com/v2.8/?ids=" + t + "&fields=embed_html,source,permalink_url,picture,published,title,content_category,content_tags,description&access_token=" + o,
          c = new XMLHttpRequest;
        c.open("get", a, !0), c.onreadystatechange = function () {
          if (c.DONE === c.readyState)
            if (200 == c.status) {
              var e = JSON.parse(c.responseText);
              if (e && e[t]) {
                document.createElement("div");
                videoSrc = "https://www.facebook.com/facebook/videos/" + t + "/";
                var o = e[t];
                return void pinstream.SaveVideoToServer({
                  webSite: 0,
                  videoId: o.id,
                  videoUrl: videoSrc || o.source,
                  title: o.title || o.description,
                  imgurl: o.picture
                }, i, n)
              }
            } else {
              savingLayer("Fail!");
            }
        }, c.send(), savingLayer("Video Saving")
      }
    })
  },
  OnSaveDailyMotionInfo: function (e, t, i) {
    pinstream.CheckLogIn(function (n) {
      var o = "https://api.dailymotion.com/video/" + t + "?fields=id,title,thumbnail_240_url",
        s = new XMLHttpRequest;
      s.open("get", o, !0), s.onreadystatechange = function () {
        if (s.DONE === s.readyState)
          if (200 == s.status) {
            var o = JSON.parse(s.responseText);
            pinstream.SaveVideoToServer({
              webSite: 2,
              videoId: t,
              videoUrl: e,
              title: o.title,
              imgurl: o.thumbnail_240_url
            }, i, n)
          } else {
            savingLayer("Fail!");
          }
      }, s.send(), savingLayer("Video Saving")
    })
  },
  OnSaveVimeoInfo: function (e, t, i) {
    pinstream.CheckLogIn(function (n) {
      var o = "https://vimeo.com/api/oembed.json?url=" + e,
        s = new XMLHttpRequest;
      s.open("get", o, !0), s.onreadystatechange = function () {
        if (s.DONE === s.readyState)
          if (200 == s.status) {
            var o = JSON.parse(s.responseText);
            pinstream.SaveVideoToServer({
              webSite: 3,
              videoId: t,
              videoUrl: e,
              title: o.title,
              imgurl: o.thumbnail_url
            }, i, n)
          } else {
            savingLayer("Fail!");
          }
      }, s.send(), savingLayer("Video Saving")
    })
  },
  SaveStorage: function (e) {
    chrome.storage.local.get("List", function (t) {
      if (t.List) {
        var i = t.List,
          n = i.filter(function (t) {
            return t.id == e.id && t.webSite == e.webSite
          });
        if (n && n.length) return void pinstream.SnedMsg({
          msg: "existed!",
          type: 4
        });
        t.List.push(e), chrome.storage.local.set({
          List: t.List
        }, function () {
          console.info("success")
        })
      } else chrome.storage.local.set({
        List: [e]
      }, function () {
        console.info("success")
      })
    })
  },
  keys: ["uid", "token", "refresh_token", "expires_in", "client_id"],
  clientid: "8ea0e82993a54155b288eeb3eba76c59",
  isExpires: function (e) {
    if (!e) return !0;
    var t = Math.floor(Date.now() / 1e3);
    return (parseInt(e[pinstream.keys[3]]) || 0) - t <= 300
  },
  RedirectLogin: function () {
    window.open(pinstream.ServerHost + "/?origin=chrome")
  },
  GetRefreshToken: function (e) {
    var t = "uid=" + e.uid + "&refresh_token=" + e.refresh_token + "&expires_in=" + e.expires_in + "&client_id=" + pinstream.clientid,
      i = new XMLHttpRequest;
    i.withCredentials = !0, i.addEventListener("readystatechange", function () {
      if (4 === this.readyState) {
        var t = JSON.parse(this.responseText);
        t.isSuccess ? chrome.storage.local.set({
          info: t
        }, function () {
          e.callback(t)
        }) : pinstream.RedirectLogin()
      }
    }), i.open("POST", pinstream.ServerHost + "/api/v1/token"), i.setRequestHeader("content-type", "application/x-www-form-urlencoded"), i.setRequestHeader("authorization", "Token " + e.token), i.setRequestHeader("cache-control", "no-cache"), i.send(t)
  },
  SaveVideoToServer: function (e, t, i) {
    var n = pinstream.ServerHost + "/api/v1/video",
      o = new XMLHttpRequest,
      s = {
        uid: i.uid,
        id: e.videoId,
        website: e.webSite,
        url: e.videoUrl,
        title: e.title,
        imgurl: e.imgurl || ""
      };
    o.open("POST", n, !0), o.setRequestHeader("authorization", "Token " + i.token), o.onreadystatechange = function () {
      if (o.DONE === o.readyState)
        if (200 == o.status) {
          var e = JSON.parse(o.responseText);
          e && void 0 !== e.isSuccess && (e.isSuccess ? savingLayer("Success!") : "Exist" === e.msg ? savingLayer("existed") : savingLayer(e.msg))
        } else 400 == o.status ? pinstream.RedirectLogin() : ( savingLayer("Fail!"), console.info(o.responseText))
    };
    var r = new FormData;
    for (var a in s) r.append(a, s[a]);
    o.send(r)
  },
  CheckLogIn: function (e) {
    chrome.storage.local.get("info", function (t) {
      if (t && t.info) {
        var i = t.info;
        if (pinstream.isExpires(i)) return i.callback = function (t) {
          e(t)
        }, void pinstream.GetRefreshToken(i);
        e(i)
      } else pinstream.RedirectLogin()
    })
  }
};
addNotifyCorner();