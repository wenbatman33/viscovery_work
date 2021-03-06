(function () {
  "use strict";

  function e(e, t) {
    t = void 0 === t || t, t ? (e.parentNode.addEventListener("mouseover", function () {
      this.parentElement.querySelector(".pin-button").style.opacity = .9
    }), e.parentNode.addEventListener("mouseleave", function () {
      this.parentElement.querySelector(".pin-button").style.opacity = 0
    })) : (e.parentNode.addEventListener("mouseover", function () {
      this.querySelector(".pin-button").style.opacity = .9
    }), e.parentNode.addEventListener("mouseleave", function () {
      this.querySelector(".pin-button").style.opacity = 0
    }))
  }

  function t(t) {
    if (!t) throw "iframeElement undefined";
    this.type = "", this.vid = "", this.url = "", this.regexList = [], this.iframeSrc = decodeURIComponent(t.src);
    var i = {
      facebook: "facebook",
      youtube: "youtu",
      dailymotion: "dailymotion",
      vimeo: "vimeo"
    },
      o = /(http|https):\/\/(player|www).(facebook|youtu|dailymotion|vimeo)/i,
      r = o.exec(this.iframeSrc);
    switch (r && r.length > 3 && (this.type = r[3].toLowerCase()), this.type) {
      case i.facebook:
        var a = /^(https|http):\/\/www.facebook.com\/plugins\/video.php\?href=/i,
          s = /(https|http):\/\/www.facebook.com\/+.*\/video(s\/(vb\..*\/(\d+)|(\d+))|\.php\?v=(\d+))/i;
        this.regexList.push(a), this.regexList.push(s);
        break;
      case i.youtube:
        var c = /(http|https):\/\/www.youtube.com\/((v|embed)\/)([\w-]+)/i;
        this.regexList.push(c);
        break;
      case i.dailymotion:
        var u = /(http|https):\/\/www.dailymotion.com\/embed\/video\/([A-Za-z0-9]+)/i;
        this.regexList.push(u);
        break;
      case i.vimeo:
        var l = /(http|https):\/\/player.vimeo.com\/video\/([A-Za-z0-9]+)/i;
        this.regexList.push(l)
    }
    if (this.regexList.forEach(function (e, t) {
      var o = e.exec(this.iframeSrc);
      switch (this.type) {
        case i.facebook:
          var r = this.regexList[0].test(this.iframeSrc);
          if (1 == t && r && o && o.length > 6) {
            var n = o[2];
            n.indexOf(".php") != -1 ? this.vid = o[6] : n.indexOf("vb.") != -1 ? this.vid = o[4] : n.indexOf("s/") != -1 && (this.vid = o[3]), this.url = o[0]
          }
          break;
        case i.youtube:
          o && o.length > 4 && (this.vid = o[4], this.url = pinstream.GetYoutuBeUrlById(this.vid));
          break;
        case i.dailymotion:
          o && o.length > 2 && (this.vid = o[2], this.url = pinstream.GetDailyMotionUrlById(this.vid));
          break;
        case i.vimeo:
          o && o.length > 2 && (this.vid = o[2], this.url = pinstream.GetVimeoUrlById(this.vid))
      }
    }, this), this.vid && this.url) {
      var h = document.createElement("div");
      h.appendChild(n(this.url, this.vid)), t.parentNode.insertBefore(h, t), h.appendChild(t), e(t)
    }
  }

  function i() {
    setTimeout(function () {
      var e = document.querySelector("#player-container");
      if (e) {
        o(e);
        var t = new CreateMutationObs({
          target: document.querySelector("#content"),
          type: pinstream.MutationObsType.customChange,
          config: {
            childList: !0,
            subtree: !0
          }
        });
        t._observerCallBack = function (e) {
          r()
        }, t.run()
      } else i()
    }, 1e3)
  }

  function o(t) {
    var i = c.exec(location.href);
    if (i.length > 6 && i[3].indexOf("youtu") != -1) {
      var o = location.href,
        r = i[6],
        a = n(o, r);
      t.children && t.children.length && (t.insertBefore(a, t.children[0]), e(t))
    }
  }

  function r() {
    var e = [".yt-lockup-thumbnail", ".thumb-wrapper", ".ux-thumb-wrap", "ytd-thumbnail"];
    e.forEach(function (e, t) {
      var i = document.querySelectorAll(e);
      i && i.length && i.forEach(function (e, t) {
        if (!e.querySelector(".pin-button")) {
          var i = e.querySelector("a");
          if (i) {
            var o = i.href,
              r = c.exec(o);
            if (c.test(o) && r[6].toLowerCase().indexOf("channel") == -1) {
              var a = n(o),
                s = e.firstChild;
              e.insertBefore(a, s)
            }
          }
        }
      })
    })
  }

  function n(e, t) {
    var i = document.createElement("button");
    return i.className = "pin-button", i.dataset.url = e, i.dataset.vid = t, i.addEventListener("click", function (e) {
      e.preventDefault();
      var t = this.dataset.url,
        i = this.dataset.vid;
      a(t, i)
    }), i
  }

  function a(e, t) {
    var i = c.exec(e);
    if (i && i.length > 2) {
      var o = i[3];
      if (o.indexOf("youtu") > -1) return void pinstream.OnSaveYoutubeInfo(e)
    }
    var r = /(http|https):\/\/www.dailymotion.com\/embed\/video\/([A-Za-z0-9]+)/i;
    return r.test(e) ? void pinstream.OnSaveDailyMotionInfo(e, t) : void pinstream.OnSaveFbInfo(e, t)
  }
  chrome.runtime.onMessage.addListener(function (i, o, r) {
    switch (i) {
      case "Loading":
        console.info("Loading");
        var a = {
          uid: localStorage.getItem("uid"),
          token: localStorage.getItem("token"),
          refresh_token: localStorage.getItem("refresh_token"),
          expires_in: localStorage.getItem("expires_in")
        };
        chrome.runtime.sendMessage({
          action: 0,
          info: a
        }, function () {
          console.info("sendMessage")
        });
        break;
      case "VideoPage":
        var s = document.querySelectorAll("iframe");
        s.forEach(function (e) {
          new t(e)
        }, this);
        break;
      case "postevent":
        var c = document.querySelectorAll("._10.uiLayer");
        return void (c && c.forEach(function (t, i) {
          var o = t.querySelectorAll("a[data-channel-id]");
          o && o.length && o.forEach(function (t, i) {
            if (!t.parentElement.querySelector(".pin-button")) {
              var o = t.href,
                r = t.dataset.videoId,
                a = n(o, r);
              t.parentNode.insertBefore(a, t), e(t)
            }
          })
        }))
    }
  });
  var s = document.querySelectorAll("iframe");
  s.forEach(function (e) {
    new t(e)
  }, this);
  var c = new RegExp(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/),
    u = c.exec(location.href);
  if (u && u[3].indexOf("youtu") > -1) {
    var l = document.querySelector("#page") || document.querySelector("#content");
    if (l) {
      var h = new CreateMutationObs({
        target: l,
        type: pinstream.MutationObsType.customChange,
        config: {
          childList: !0,
          subtree: !0
        }
      });
      h._observerCallBack = function (e) {
        if (e && e.length) {
          var t = e[0].target.className.toLowerCase();
          if ("ytp-time-current" == t || "ytp-tooltip-text" == t) return;
          r()
        }
      }, h.run()
    }
    var d = document.querySelector("#player #player-mole-container");
    d ? o(d) : document.querySelector("#player #player-api") && i()
  }
})();