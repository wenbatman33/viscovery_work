////// <reference path="/utilities.js" />
(function () {
    'use strict';

    //http://stackoverflow.com/questions/14234560/javascript-how-to-get-parent-element-by-selector
    function collectionHas(a, b) { //helper function (see below)
        for (var i = 0, len = a.length; i < len; i++) {
            if (a[i] == b) return true;
        }
        return false;
    }

    function findParentBySelector(elm, selector) {
        var all = document.querySelectorAll(selector);
        var cur = elm.parentNode;
        while (cur && !collectionHas(all, cur)) { //keep going up until you find a match
            cur = cur.parentNode; //go up
        }
        return cur; //will return null if not found
    }

    function createMutation(target, callback, config) {
        if (!target) {
            return
        }

        var observer = new MutationObserver(function (mutations) {
            callback(mutations);
        });

        var fbbodyConfig = config || { childList: true };
        observer.observe(target, fbbodyConfig);
        return observer;
    }

    function addmouseEvent(targetElement, isParentElement) {
        isParentElement = isParentElement === undefined ? true : isParentElement
        //todo after modify
        if (isParentElement) {
            targetElement.parentNode.addEventListener('mouseover', function () {
                this.parentElement.querySelector('.pin-button').style.opacity = 0.9;
            });

            targetElement.parentNode.addEventListener('mouseleave', function () {
                this.parentElement.querySelector('.pin-button').style.opacity = 0;
            });
        } else {
            targetElement.parentNode.addEventListener('mouseover', function () {
                this.querySelector('.pin-button').style.opacity = 0.9;
            });

            targetElement.parentNode.addEventListener('mouseleave', function () {
                this.querySelector('.pin-button').style.opacity = 0;
            });
        }
    }

    chrome.runtime.onMessage.addListener(function (msg, sss, sendResponse) {
        switch (msg) {
            case "Loading":
                console.info("Loading")
                var info = {
                    uid: localStorage.getItem('uid'),
                    token: localStorage.getItem('token'),
                    refresh_token: localStorage.getItem('refresh_token'),
                    expires_in: localStorage.getItem('expires_in'),
                }
                chrome.runtime.sendMessage({ action: 0, info: info }, function () {
                    console.info('sendMessage')
                });
                break;
            case "VideoPage":
                var iframes = document.querySelectorAll('iframe');
                iframes.forEach(function (element) {
                    var vbtn = new VideoIframeButton(element);
                }, this);
                break;
            case "postevent":
                var popupArea = document.querySelectorAll('._10.uiLayer')
                if (popupArea) {
                    popupArea.forEach(function (item, index) {
                        var popupVideoItems = item.querySelectorAll('a[data-channel-id]');
                        if (popupVideoItems && popupVideoItems.length) {
                            popupVideoItems.forEach(function (item2, index) {
                                if (item2.parentElement.querySelector('.pin-button')) {
                                    return;
                                }
                                var link = item2.href;
                                var vid = item2.dataset.videoId;//maybe not value
                                var btn = createButton(link, vid);
                                item2.parentNode.insertBefore(btn, item2);
                                addmouseEvent(item2);
                            })
                            // console.info("@@@@@@@@@@@@@@@@@@@@@@@@@@")
                            // console.info(popupVideoItems)
                        }
                    })
                }
                return;
        }
    });

    function VideoIframeButton(iframeElement) {
        if (!iframeElement) {
            throw 'iframeElement undefined'
        }

        this.type = '';
        this.vid = '';
        this.url = '';
        this.regexList = [];
        this.iframeSrc = decodeURIComponent(iframeElement.src);

        var matchSiteNames = {
            facebook: 'facebook',
            youtube: 'youtu',
            dailymotion: 'dailymotion',
            vimeo: 'vimeo'
        };

        var webSite = /(http|https):\/\/(player|www).(facebook|youtu|dailymotion|vimeo)/i;
        var mWebSite = webSite.exec(this.iframeSrc);
        if (mWebSite && mWebSite.length > 3) {
            this.type = mWebSite[3].toLowerCase();
        }

        //set regex
        switch (this.type) {
            case matchSiteNames.facebook:
                var tfbVideo = /^(https|http):\/\/www.facebook.com\/plugins\/video.php\?href=/i;
                var tfb = /(https|http):\/\/www.facebook.com\/+.*\/video(s\/(vb\..*\/(\d+)|(\d+))|\.php\?v=(\d+))/i;
                //https://www.facebook.com/xx/videos/123
                //https://www.facebook.com/xx/video.php?v=123
                //https://www.facebook.com/xx/videos/vb.000000/123/?type=2&theater
                this.regexList.push(tfbVideo)
                this.regexList.push(tfb)
                break;
            case matchSiteNames.youtube:
                //https://developers.google.com/youtube/player_parameters
                var tYoube = /(http|https):\/\/www.youtube.com\/((v|embed)\/)([\w-]+)/i;
                //http://www.youtube.com/embed/zpOULjyy-n8
                //http://www.youtube.com/embed/zpOULjyy-n8?rel=0
                //http://www.youtube.com/v/zpOULjyy-n8 //todo test page
                this.regexList.push(tYoube)
                break;
            case matchSiteNames.dailymotion:
                //https://developer.dailymotion.com/player#player-parameters
                var tDailyMotion = /(http|https):\/\/www.dailymotion.com\/embed\/video\/([A-Za-z0-9]+)/i;
                this.regexList.push(tDailyMotion)
                break;
            case matchSiteNames.vimeo:
                var tVimeo = /(http|https):\/\/player.vimeo.com\/video\/([A-Za-z0-9]+)/i;
                this.regexList.push(tVimeo)
                break;
        }

        //set vid & url
        this.regexList.forEach(function (regex, index) {
            var m = regex.exec(this.iframeSrc);
            switch (this.type) {
                case matchSiteNames.facebook:
                    var isfbVideo = this.regexList[0].test(this.iframeSrc);
                    if (index == 1 && isfbVideo && m && m.length > 6) {
                        var type = m[2];
                        if (type.indexOf(".php") != -1) {
                            this.vid = m[6];
                        } else if (type.indexOf("vb.") != -1) {
                            this.vid = m[4];
                        } else if (type.indexOf("s/") != -1) {
                            this.vid = m[3];
                        }
                        //https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/videos/{id}/
                        this.url = m[0];
                    }
                    break;
                case matchSiteNames.youtube:
                    if (m && m.length > 4) {
                        this.vid = m[4];
                        this.url = pinstream.GetYoutuBeUrlById(this.vid);
                    }
                    break;
                case matchSiteNames.dailymotion:
                    if (m && m.length > 2) {
                        this.vid = m[2];
                        this.url = pinstream.GetDailyMotionUrlById(this.vid);
                    }
                    break;
                case matchSiteNames.vimeo:
                    if (m && m.length > 2) {
                        this.vid = m[2];
                        this.url = pinstream.GetVimeoUrlById(this.vid);
                    }
                    break;
            }
        }, this);

        //add button
        if (this.vid && this.url) {
            var wrp = document.createElement('div');
            wrp.appendChild(createButton(this.url, this.vid))
            iframeElement.parentNode.insertBefore(wrp, iframeElement);
            wrp.appendChild(iframeElement);
            addmouseEvent(iframeElement);
        }
    }

    //get current page iframes
    var iframes = document.querySelectorAll('iframe');
    iframes.forEach(function (element) {
        var vbtn = new VideoIframeButton(element);
    }, this);

    //when if youtube page
    //ref https://gist.github.com/yangshun/9892961
    var regexYoutubeWithViemo = new RegExp(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    var siteCheck = regexYoutubeWithViemo.exec(location.href);
    if (siteCheck && siteCheck[3].indexOf('youtu') > -1) {
        var youtubePageTarget = document.querySelector('#page');

        if (youtubePageTarget) {
            var youtubeConfig = { childList: true, subtree: true };

            var youtubeObserver = new MutationObserver(function (mutations) {
                if (mutations && mutations.length) {
                    var targetName = mutations[0].target.className.toLowerCase();
                    if ((targetName == 'ytp-time-current') || (targetName == 'ytp-tooltip-text')) {
                        return;
                    }
                    //console.info(mutations.length);
                    youtubeObserver.disconnect();
                    addbuttonToYoutube();
                    youtubeObserver.observe(youtubePageTarget, youtubeConfig);
                }
            });
            youtubeObserver.observe(youtubePageTarget, youtubeConfig);
            //console.info("page-container")
        }

        //youtube replace .ytp-right-controls target
        var youtubePlayerContainer = document.querySelector('#player #player-mole-container');
        if (youtubePlayerContainer) {
            var m = regexYoutubeWithViemo.exec(location.href)
            if (m.length > 6 && m[3].indexOf('youtu') != -1) {
                var link = location.href;
                var vid = m[6];
                var btn = createButton(link, vid);
                if (youtubePlayerContainer.children && youtubePlayerContainer.children.length) {
                    youtubePlayerContainer.insertBefore(btn, youtubePlayerContainer.children[0]);
                    addmouseEvent(youtubePlayerContainer);
                }
            }
        }
    }

    function buindLoadMore() {
        //home page
        var target = document.querySelector('.section-list');
        //my channels page
        target = (target) || document.querySelector('#channels-browse-content-grid');
        //item side bar page
        target = (target) || document.querySelectorAll('.thumb-wrapper');

        if (target) {
            var observer = new MutationObserver(function (mutations) {
                if (mutations && mutations.length) {
                    console.log(mutation.type);
                    addbuttonToYoutube();
                }
            });

            var config = { childList: true };
            observer.observe(target, config);

            addbuttonToYoutube();
            // console.info(".section-list")
        }
    }

    function addbuttonToYoutube() {
        var list = ['.yt-lockup-thumbnail', '.thumb-wrapper', '.ux-thumb-wrap'];
        list.forEach(function (item, index) {
            var targets = document.querySelectorAll(item);
            if (targets && targets.length) {
                targets.forEach(function (item, index) {
                    //filter exsit button
                    if (item.querySelector('.pin-button')) {
                        return;
                    }
                    var aTag = item.querySelector('a');
                    if (!aTag) {
                        return;
                    }
                    var link = aTag.href;
                    var m = regexYoutubeWithViemo.exec(link);
                    if (regexYoutubeWithViemo.test(link) && m[6].toLowerCase().indexOf('channel') == -1) {
                        var btn = createButton(link);
                        var fChild = item.firstChild;
                        item.insertBefore(btn, fChild);
                        // item.appendChild(btn);
                    }

                })
            }
        })
    }

    function createButton(link, vid) {
        var button = document.createElement('button');
        button.className = 'pin-button';
        button.dataset.url = link;
        button.dataset.vid = vid;
        button.addEventListener('click', function (event) {
            event.preventDefault();
            var url = this.dataset.url;
            var vid = this.dataset.vid;
            checkAndSaveUrl(url, vid);
        })
        return button;
    }

    function checkAndSaveUrl(link, vid) {
        var m = regexYoutubeWithViemo.exec(link)
        if (m && m.length > 2) {
            var sourceSite = m[3];
            if (sourceSite.indexOf('youtu') > -1) {
                pinstream.OnSaveYoutubeInfo(link);
                return;
            }
        }

        var t = /(http|https):\/\/www.dailymotion.com\/embed\/video\/([A-Za-z0-9]+)/i;

        if (t.test(link)) {
            pinstream.OnSaveDailyMotionInfo(link, vid);
            return;
        }

        //var videoId = m[6];
        //todo viemo or fb
        pinstream.OnSaveFbInfo(link, vid);
    }
})();