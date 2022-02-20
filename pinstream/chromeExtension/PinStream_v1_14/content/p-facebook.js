/// <reference path="../utilities.js" />
(function () {
    'use strict';
    // console.info('run facebook js');
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

    /** @description set PinVideoButton
    * @param {{element:object, elementParentNodeIndex:number,webSiteName:number,vid:number}} opts element
    */
    function PinVideoButtonModel(opts) {
        opts = opts || {};
        this._element = opts.element;
        this._webSiteName = opts.webSiteName;

        this.vid = opts.vid || '';
        this.url = '';

        this.mouseEventNodeIndex = 0;
        this._elementParentNodeIndex = opts.elementParentNodeIndex || 1;

        if (!this._element) {
            throw 'element undefined'
        }

        if (this._webSiteName === undefined) {
            throw '_webSiteName undefined'
        }

        var pinbtnParent = this._element;

        for (var i = 0; i < this._elementParentNodeIndex; i++) {
            pinbtnParent = this._element.parentElement
        }

        this.onAddButtonToNode = function (btn) {
            if (pinbtnParent.hasChildNodes() && pinbtnParent.children[0].className &&
                pinstream.PinBtnCSSName.indexOf(pinbtnParent.children[0].className) != -1) {
                return true;
            }

            //var insertedNode = parentNode.insertBefore(newNode, referenceNode);
            pinbtnParent.insertBefore(btn, pinbtnParent.children[0]);
            return false;
        }

        this.createButton = function (link, vid) {
            return new CreatePinButton(link, vid, this._webSiteName);
        }

        this.onAddMouseEvent = function (targetElement) {

            targetElement.addEventListener('mouseover', function () {
                this.querySelector(pinstream.PinBtnCSSName).style.opacity = 0.9;
            });

            targetElement.addEventListener('mouseleave', function () {
                this.querySelector(pinstream.PinBtnCSSName).style.opacity = 0;
            });
        }

        if (this.vid) {

            this.url = pinstream.GetEmbedUrl(this._webSiteName, this.vid);

            var btn = this.createButton(this.url, this.vid);

            var isExist = this.onAddButtonToNode(btn);

            if (!isExist) {
                this.onAddMouseEvent(pinbtnParent);
            }
        }
    }

    function CheckADVideos() {
        // console.info(document.querySelectorAll('div._5lel a[data-video-id]'));
        var videosContainer = document.querySelectorAll('._6m8');
        videosContainer.forEach(function (item) {
            //add icon to item
            var button = item.querySelectorAll(pinstream.PinBtnCSSName);
            if (!button) {
                return;
            }
            var videourl = '';
            var msgContainer = findParentBySelector(item, '._5jmm');
            if (msgContainer) {
                var shareContainer = msgContainer.querySelectorAll('._ipm');
                var t = /(https|http):\/\/www.facebook.com\/+.*\/videos\/(\d+)/i;
                var model = null;
                if (shareContainer && shareContainer.length) {
                    shareContainer.forEach(function (sitem) {
                        var pitem = item;
                        var m = t.exec(sitem.href);
                        if (m && m.length > 0 && m[2]) {
                            var vid = m[2];
                            model = new PinVideoButtonModel({
                                element: item,
                                webSiteName: pinstream.WebSiteName.fb,
                                vid: vid
                            })
                            return;
                        }

                    });
                }
                if (!model) {
                    var hidenContainer = item.querySelectorAll('._2za_');
                    if (hidenContainer && hidenContainer.length) {
                        hidenContainer.forEach(function (hitem) {
                            var pitem = item;
                            var m = t.exec(hitem.href);
                            if (m && m.length > 0 && m[2]) {
                                var vid = m[2];
                                model = new PinVideoButtonModel({
                                    element: item,
                                    webSiteName: pinstream.WebSiteName.fb,
                                    vid: vid
                                })
                                return;
                            };
                        });
                    }
                }
            }
            //
        });
    }

    function addmouseEvent(targetElement, isParentElement = true) {
        //todo after modify
        if (isParentElement) {
            targetElement.parentNode.addEventListener('mouseover', function () {
                this.parentElement.querySelector(pinstream.PinBtnCSSName).style.opacity = 0.9;
            });

            targetElement.parentNode.addEventListener('mouseleave', function () {
                this.parentElement.querySelector(pinstream.PinBtnCSSName).style.opacity = 0;
            });
        } else {
            targetElement.parentNode.addEventListener('mouseover', function () {
                this.querySelector(pinstream.PinBtnCSSName).style.opacity = 0.9;
            });

            targetElement.parentNode.addEventListener('mouseleave', function () {
                this.querySelector(pinstream.PinBtnCSSName).style.opacity = 0;
            });
        }
    }

    function createButton(link, vid) {
        var button = new CreatePinButton(link, vid, pinstream.WebSiteName.fb);
        return button;
    }

    function CheckOthersVideos() {
        var fbVideos = document.querySelectorAll('[data-video-id]');
        if (fbVideos && fbVideos.length) {
            fbVideos.forEach(function (item, index) {
                var parentElement = findParentBySelector(item, '.fbUserContent');
                var link = item.href;
                var vid = item.dataset.videoId;
                if (parentElement) {
                    var videos = parentElement.querySelectorAll('video');
                    if (!(videos && videos.length)) {
                        var videoPageItem = findParentBySelector(item, '#stream_pagelet');
                        if (videoPageItem) {
                            var video = videoPageItem.parentElement.querySelector('#permalink_video_pagelet video');
                            if (!video) {
                                return;
                            }

                            if (video.parentElement.querySelector(pinstream.PinBtnCSSName)) {
                                return;
                            }
                            var btn = createButton(link, vid);
                            video.parentNode.insertBefore(btn, video);
                            // video.parentNode.appendChild(btn);
                            addmouseEvent(video);
                        }
                    }
                    if (parentElement.querySelector(pinstream.PinBtnCSSName)) {
                        return;
                    }
                    videos.forEach(function (vitem, vindex) {
                        var btn = createButton(link, vid);
                        vitem.parentNode.insertBefore(btn, vitem);
                        // vitem.parentNode.appendChild(btn);
                        addmouseEvent(vitem);
                    })
                } else {
                    parentElement = findParentBySelector(item, '#videos');
                    if (!parentElement) {
                        //video page right side video
                        //ex:https://www.facebook.com/Mr.Player.tw/videos/828266790684499/
                        if (!findParentBySelector(item, '#video_permalink_related_pagelet')) {
                            return;
                        }
                        if (item.parentElement.querySelector(pinstream.PinBtnCSSName) ||
                            (item.parentElement.tagName.toLowerCase() === 'span'
                                && item.parentElement.className.indexOf('fsm') !== -1)) {
                            return;
                        }
                        var divBtn = createButton(link, vid);
                        item.parentNode.insertBefore(divBtn, item);
                        addmouseEvent(item, false);
                    } else {
                        if (item.parentElement.querySelector(pinstream.PinBtnCSSName)) {
                            return;
                        }
                        var btn = createButton(link, vid);
                        item.parentNode.insertBefore(btn, item);
                        //item.parentNode.appendChild(btn);
                        addmouseEvent(item, false);
                    }
                }

            })
        }
    }

    var fbTarget = document.querySelector('#globalContainer');
    if (fbTarget) {
        var fbconfig = { childList: true, subtree: true };
        var c = new CreateMutationObs({
            target: fbTarget,
            type: pinstream.MutationObsType.customChange,
            config: fbconfig
        });
        c._observerCallBack = function (mutation) {
            if (mutation && mutation.length) {
                CheckADVideos();
                CheckOthersVideos();
            }
        }
        c.run();
    }

})();