/// <reference path="../utilities.js" />
(function () {
    'use strict';

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
            return CreatePinButton(link, vid, pinstream.WebSiteName.vimeo);
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

    var vimeoInfo = {
        videoRegexVimeoDefault: 'vimeo-default',
        videoRegexVimeoCOG: 'vimeo-channel-ondemand-Group',
        videoRegexVimeoO: "vimeo-ondemand",
        videoRegexVimeoGOC: "vimeo-group-ondemand-channel",
        videoRegexVimeoClipId: "vimeo-clip-id",
        embedUrlVimeo: 'vimeo'
    };

    function GetVideoRegex(type) {
        switch (type) {
            case vimeoInfo.videoRegexVimeoDefault:
                // https://vimeo.com/*
                // => https://vimeo.com/123
                // => https://vimeo.com/ssxxx

                // https://vimeo.com/*/*/video/*
                // => https://vimeo.com/sss/sss/video/1234

                // https://vimeo.com/album/*/video/*

                // https://vimeo.com/groups/*/videos/*
                // => https://vimeo.com/groups/motion/videos/218647593

                // https://vimeo.com/channels/*/*
                // => https://vimeo.com/channels/1341/220288289
                // => https://vimeo.com/channels/worldhd/220555992

                // https://vimeo.com/ondemand/*/*
                // => https://vimeo.com/ondemand/visibles
                // => https://vimeo.com/ondemand/ondemand/worldoftomorrow
                // return /(https|http):\/\/vimeo.com\/(([\w]+\/[\w]+\/+video\/[\w]+)|((ondemand|channels)\/([\w]+\/[\w]+|))|((groups|album)\/[\w]+\/video(s|)\/[\w]+)|[\w]+)$/i;
                return /(https|http):\/\/vimeo.com\/(([\w]+\/[\w]+\/+video\/[\w]+)|((ondemand|channels)\/([\w]+)(\/[\w]+|))|((groups|album)\/[\w]+\/video(s|)\/[\w]+)|[\w]+)$/i;
            case vimeoInfo.videoRegexVimeoCOG:
                return /(http|https):\/\/vimeo.com\/((channels|ondemand)\/\w+\/|(ondemand\/|channels\/|groups\/\w+\/videos\/|))(\d+)$/i;
            case vimeoInfo.videoRegexVimeoO:
                return /(http|https):\/\/vimeo.com\/(ondemand)\/\w+$/i;
            case vimeoInfo.videoRegexVimeoGOC:
                // /groups/motion/videos/221243573
                // /ondemand/sembene/188005452
                // /channels/bestofthemonth/216131664
                return /(groups\/\w+\/videos|ondemand\/\w+\/|channels\/\w+)/;
            case vimeoInfo.videoRegexVimeoClipId:
                return /^clip_(\d+)$/i;
        }
    }

    function createButton(link, vid) {
        return CreatePinButton(link, vid, pinstream.WebSiteName.vimeo);
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

    function AddButtonToTarget(videos) {
        videos.forEach(function (item) {
            var t = GetVideoRegex(vimeoInfo.videoRegexVimeoCOG);
            var m = t.exec(item.href);
            if (m && m.length > 5) {
                if (item.parentNode.querySelector(pinstream.PinBtnCSSName)) {
                    return;
                }
                var type = m[2];
                var vid = "";
                var tGroup = GetVideoRegex(vimeoInfo.videoRegexVimeoGOC);
                if (!type || tGroup.test(m[2])) {
                    vid = m[5];
                } else if (item.dataset.fatalAttraction) {
                    var p = "keyword:";
                    var tId = /\d+/i
                    var m2 = tId.exec(item.dataset.fatalAttraction.substr(item.dataset.fatalAttraction.indexOf(p) + p.length));
                    if (m2 && m2.length) {
                        vid = m2[0];
                    }
                } else {
                    GetRequestVideoId(item.href, function (reqResult) {
                        // var vid = reqResult.video_id;
                        // var url = pinstream.GetVimeoUrlById(vid);
                        // item.parentNode.insertBefore(createButton(url, vid), item);
                        // addmouseEvent(item, false);                        
                        new PinVideoButtonModel({
                            element: item,
                            webSiteName: pinstream.WebSiteName.vimeo,
                            vid: reqResult.video_id
                        })
                    })
                }
                if (vid) {
                    new PinVideoButtonModel({
                        element: item,
                        webSiteName: pinstream.WebSiteName.vimeo,
                        vid: vid
                    })
                    // var url = pinstream.GetVimeoUrlById(vid);
                    // item.parentNode.insertBefore(createButton(url, vid), item);
                    // addmouseEvent(item, false);
                }
            } else if (item.dataset.fatalAttraction) {
                //test page https://vimeo.com/categories/experimental
                if (item.parentNode.querySelector(pinstream.PinBtnCSSName)) {
                    return;
                }
                var p = "keyword:";
                var tId = /\d+/i
                var m2 = tId.exec(item.dataset.fatalAttraction.substr(item.dataset.fatalAttraction.indexOf(p) + p.length));
                var vid = "";
                if (m2 && m2.length) {
                    vid = m2[0];
                }
                if (!vid) {
                    return;
                }
                new PinVideoButtonModel({
                    element: item,
                    webSiteName: pinstream.WebSiteName.vimeo,
                    vid: vid
                })
                // var url = pinstream.GetVimeoUrlById(vid);
                // item.parentNode.insertBefore(createButton(url, vid), item);
                // addmouseEvent(item, false);
                // console.info(item);
            } else {
                if (item.parentNode.querySelector(pinstream.PinBtnCSSName)) {
                    return;
                }
                GetRequestVideoId(item.href, function (reqResult) {
                    new PinVideoButtonModel({
                        element: item,
                        webSiteName: pinstream.WebSiteName.vimeo,
                        vid: reqResult.video_id
                    })
                    // var vid = reqResult.video_id;
                    // var url = pinstream.GetVimeoUrlById(vid);
                    // item.parentNode.insertBefore(createButton(url, vid), item);
                    // addmouseEvent(item, false);
                })
            }
        });
    }

    function checkParentElement(itemElement) {
        //todo has img
        //todo '#wrap > #main > #content > #cols'
        return (itemElement.parentElement.className.indexOf("pagination_holder") == -1 && itemElement.parentElement.className.indexOf("contextclip-header") == -1
            && itemElement.parentElement.className.indexOf("title") == -1
            && itemElement.parentElement.className.indexOf("data") == -1);
    }

    function OnAddButtonWithKeyword(item) {
        //test page https://vimeo.com/home/page videos icon
        if (item.parentNode.parentNode.querySelector(pinstream.PinBtnCSSName)) {
            return;
        }
        var p = "keyword:";
        var tId = /\d+/i
        var m2 = tId.exec(item.dataset.fatalAttraction.substr(item.dataset.fatalAttraction.indexOf(p) + p.length));
        var vid = "";
        if (m2 && m2.length) {
            vid = m2[0];
        }
        if (!vid) {
            return;
        }
        new PinVideoButtonModel({
            element: item.parentElement,
            webSiteName: pinstream.WebSiteName.vimeo,
            vid: vid
        })
    }

    function BindGroupPage() {
        var content = document.querySelector('#content #browse_content');
        if (content) {
            // console.info('BindGroupPage')
            var imgs = document.querySelectorAll('#content #browse_content a > img');
            var videos = [];
            imgs.forEach(function (element) {
                videos.push(element.parentElement);
            }, this);

            AddButtonToTarget(videos);

            var browserElement = document.querySelector('#content #browser');
            if (browserElement) {
                var c = new CreateMutationObs({
                    target: browserElement,
                    type: pinstream.MutationObsType.childList
                });
                c._observerCallBack = function (ms) {
                    // console.info('browser');

                    var imgs = document.querySelectorAll('#content #browse_content a > img');
                    var videos = [];
                    imgs.forEach(function (element) {
                        videos.push(element.parentElement);
                    }, this);
                    AddButtonToTarget(videos);

                    //login home page
                    var btns = document.querySelectorAll('#browse_content .player_wrapper button.play');
                    if (btns && btns.length) {
                        btns.forEach(function (item) {
                            OnAddButtonWithKeyword(item)
                        }, this);
                    }

                    var olElement = document.querySelectorAll('#browse_content ol.js-browse_list');
                    olElement.forEach(function (item) {
                        var c = new CreateMutationObs({
                            target: item,
                            type: pinstream.MutationObsType.childList
                        })
                        c._observerCallBack = function (ms) {
                            var imgs = document.querySelectorAll('#content #browse_content a > img');
                            var videos = [];
                            imgs.forEach(function (element) {
                                videos.push(element.parentElement);
                            }, this);
                            AddButtonToTarget(videos);

                            var btns = document.querySelectorAll('#browse_content .player_wrapper button.play');
                            btns.forEach(function (item) {
                                OnAddButtonWithKeyword(item)
                            }, this);
                        }
                        c.run();
                    })
                }
                c.run();
            }
            return true;
        }
        return false;
    }

    function GetRequestVideoId(url, callback) {
        //test page https://vimeo.com/categories/experimental/freshideas/videos
        //test page https://vimeo.com/search/ondemand?q=test
        if (!document.querySelector('.search_filter_menu')) {
            var tDefault = GetVideoRegex(vimeoInfo.videoRegexVimeoDefault);
            if (!tDefault.test(url)) {
                // console.info("GetRequestVideoId")
                // console.info(url)
                return;
            }
        }

        var apiURL = `https://vimeo.com/api/oembed.json?url=${url}`;
        var xhr = new XMLHttpRequest();
        xhr.open('get', apiURL, true);
        xhr.onreadystatechange = function () {
            if (xhr.DONE === xhr.readyState) {
                if (xhr.status == 200) {
                    var reqResult = JSON.parse(xhr.responseText);
                    //https://developer.vimeo.com/apis/oembed
                    callback(reqResult)
                } else {
                    //console.log("error" + xhr.status)
                    return;
                }
            }
        }
        xhr.send(null);
    }

    function HomeContent(homeVideos) {
        if (homeVideos) {
            AddButtonToTarget(homeVideos);
            homeVideos.forEach(function (item) {
                var c = new CreateMutationObs({
                    target: item,
                    type: pinstream.MutationObsType.customChange,
                    config: { attributes: true, attributeFilter: ["href"] }
                });
                c._observerCallBack = function (ms) {
                    // console.info('HomeContent _observerCallBack')
                    if (ms && ms.length) {
                        var item = ms[0].target;
                        updateButton(item)
                    }
                };
                c.run();
            })
        }
    }

    function updateButton(item) {
        var btn = item.parentNode.querySelector(pinstream.PinBtnCSSName)
        if (btn) {
            var t = GetVideoRegex(vimeoInfo.videoRegexVimeoCOG);
            var m = t.exec(item.href);
            if (m && m.length > 5) {
                var type = m[2];
                var vid = "";
                var tGroup = GetVideoRegex(vimeoInfo.videoRegexVimeoGOC);
                if (!type || tGroup.test(m[2])) {
                    vid = m[5];
                } else if (item.dataset.fatalAttraction) {
                    var p = "keyword:";
                    var tId = /\d+/i
                    var m2 = tId.exec(item.dataset.fatalAttraction.substr(item.dataset.fatalAttraction.indexOf(p) + p.length));
                    if (m2 && m2.length) {
                        vid = m2[0];
                    }
                }
                if (vid) {
                    btn.dataset.url = pinstream.GetVimeoUrlById(vid);
                    btn.dataset.vid = vid;
                    btn.title = btn.dataset.url;
                } else {
                    GetRequestVideoId(item.href, function (reqResult) {
                        btn.dataset.url = pinstream.GetVimeoUrlById(reqResult.video_id);
                        btn.dataset.vid = reqResult.video_id;
                        btn.title = btn.dataset.url;
                    })
                }
            } else {
                GetRequestVideoId(item.href, function (reqResult) {
                    btn.dataset.url = pinstream.GetVimeoUrlById(reqResult.video_id);
                    btn.dataset.vid = reqResult.video_id;
                    btn.title = btn.dataset.url;
                })
            }
        }
    }

    //home page
    var homeVideos = document.querySelectorAll('.wrap_content .iris_video-vital > a');
    if (homeVideos && homeVideos.length) {
        HomeContent(homeVideos);
        var gridContent = document.querySelectorAll('#wrap .wrap_content .iris_p_infinite__grid');
        var items = document.querySelectorAll('#wrap .wrap_content .iris_p_infinite__grid .iris_p_infinite__item')
        if (items && items.length) {
            var c = new CreateMutationObs({
                target: items[0],
                type: pinstream.MutationObsType.childList
            });
            c._observerCallBack = function (ms) {
                var homeVideos = document.querySelectorAll('.wrap_content .iris_video-vital > a');
                HomeContent(homeVideos)
            }
            c.run();
        }
    }

    var categoriesImg = document.querySelectorAll('.wrap_content .category_container a > img');
    if (categoriesImg && categoriesImg.length) {
        var videos = [];
        categoriesImg.forEach(function (item) {
            videos.push(item.parentElement);
        })
        AddButtonToTarget(videos);

        var c = new CreateMutationObs({
            target: document.querySelector('.wrap_content .category_container .more_categories_div'),
            type: pinstream.MutationObsType.childList
        });
        c._observerCallBack = function (ms) {
            var categoriesImg = document.querySelectorAll('.wrap_content .category_container a > img');
            var videos = [];
            categoriesImg.forEach(function (item) {
                videos.push(item.parentElement);
            })
            AddButtonToTarget(videos);
        }
        c.run();
    }

    //home page
    var homeSlidesContainer = document.querySelectorAll('.video_thumb_carousel__slides');
    if (homeSlidesContainer) {
        homeSlidesContainer.forEach(function (item) {
            var c = new CreateMutationObs({
                target: item,
                type: pinstream.MutationObsType.childList
            });
            c._observerCallBack = function (ms) {
                var homeVideos = document.querySelectorAll('.wrap_content .iris_video-vital > a');
                AddButtonToTarget(homeVideos)
                // console.info('_observerCallBack')
            }

            c.run();
        });
    }

    //video sidebar page
    var pageVideos = document.querySelectorAll('#main a');
    if (pageVideos) {
        if (BindGroupPage()) {
            return;
        }

        var tempData = [];
        pageVideos.forEach(function (item) {
            if (checkParentElement(item)) {
                tempData.push(item);
            }
        });

        AddButtonToTarget(tempData);
    }

    //var pageSlidesContainer = document.querySelector('#main .contextclip-items > span');
    //test page https://vimeo.com/channels/staffpicks/136386845
    //test page https://vimeo.com/221417668
    var pageSlidesContainer = document.querySelector('#main .contextclip-items > span') || document.querySelector('#main .clip-contextual-clips > div');

    if (pageSlidesContainer) {
        var pc = new CreateMutationObs({
            target: pageSlidesContainer,
            type: pinstream.MutationObsType.childList
        });
        pc._observerCallBack = function () {
            var pageVideos = document.querySelectorAll('#main a');
            tempData = []
            pageVideos.forEach(function (item) {
                if (checkParentElement(item)) {
                    tempData.push(item);
                }
            });
            AddButtonToTarget(tempData);

            var pageSlidesContainer = document.querySelector('#main .contextclip-items > span');
            var c = new CreateMutationObs({
                target: pageSlidesContainer,
                type: pinstream.MutationObsType.childList
            });
            c._observerCallBack = function () {
                var pageVideos = document.querySelectorAll('#main a');
                tempData = []
                pageVideos.forEach(function (item) {
                    if (checkParentElement(item)) {
                        tempData.push(item);
                    }
                });
                AddButtonToTarget(tempData)
                // console.info('_observerCallBack')
            }
            c.run();
        }
        pc.run();
    }

    function GetClipId(id) {
        var t = GetVideoRegex(vimeoInfo.videoRegexVimeoClipId);
        var m = t.exec(id);
        if (!m || m.length == 0) {
            return null;
        }
        return m[1];
    }

    //test page https://vimeo.com/ondemand/33899
    //test page https://vimeo.com/211387965
    //test page https://vimeo.com/groups/motion/videos/218647593
    var pageContainer = document.querySelectorAll('.player_container');
    if (pageContainer && pageContainer.length) {
        //todo no match https://vimeo.com/channels/1341
        if (pageContainer.length > 1) {
            //test page https://vimeo.com/channels/50944
            pageContainer.forEach(function (item) {
                var vid = GetClipId(item.id);
                if (vid) {
                    new PinVideoButtonModel({
                        element: item.children[0],
                        webSiteName: pinstream.WebSiteName.vimeo,
                        vid: vid
                    })
                }
            })
            return;
        }

        var index = 5;
        pageContainer.forEach(function (item) {
            var t = GetVideoRegex(vimeoInfo.videoRegexVimeoClipId);
            var m = t.exec(item.id);
            if (!m || m.length == 0) {
                t = GetVideoRegex(vimeoInfo.videoRegexVimeoCOG);
                m = t.exec(location.href);
                if (!m || m.length == 0) {
                    return;
                }
            }
            if (m && m.length == 2) {
                var vid = m[1];
                if (vid) {
                    new PinVideoButtonModel({
                        element: item.children[0],
                        webSiteName: pinstream.WebSiteName.vimeo,
                        vid: vid
                    })
                }
                var c2 = new CreateMutationObs({
                    target: item,
                    type: pinstream.MutationObsType.customChange,
                    config: { attributes: true, attributeFilter: ["id"] }
                });

                c2._observerCallBack = function (ms) {
                    if (ms && ms.length) {
                        var item = ms[0].target;
                        var vid = GetClipId(item.id);
                        if (vid) {
                            var btn = item.querySelector(pinstream.PinBtnCSSName)
                            btn.dataset.vid = vid;
                            btn.dataset.url = pinstream.GetVimeoUrlById(vid);
                            btn.title = btn.dataset.url;
                        }
                    }
                }
                c2.run();
                return
            } else if (m && m.length > index) {
                debugger
                if (item.querySelector(`.player_container > ${pinstream.PinBtnCSSName}`)) {
                    return;
                }

                if (!item.hasChildNodes()) {
                    return;
                }

                var childEle = item.children[0];
                var vid = childEle.id;
                if (!vid || !vid.match(/^\d+$/i)) {
                    return;
                }
                //test page https://vimeo.com/221417668
                new PinVideoButtonModel({
                    element: childEle,
                    webSiteName: pinstream.WebSiteName.vimeo,
                    vid: vid
                })
            } else {
                debugger
                var t = GetVideoRegex(vimeoInfo.videoRegexVimeoO);
                var m = t.exec(location.href);
                if (!m) {
                    return;
                }

                if (item.querySelector(`.player_container > ${pinstream.PinBtnCSSName}`)) {
                    return;
                }

                if (!item.children || item.children.length == 0) {
                    return;
                }

                var childEle = item.children[0];
                var vid = childEle.id;
                if (!vid || !vid.match(/^\d+$/i)) {
                    return;
                }
                new PinVideoButtonModel({
                    element: childEle,
                    webSiteName: pinstream.WebSiteName.vimeo,
                    vid: vid
                })
            }

            var c2 = new CreateMutationObs({
                target: item,
                type: pinstream.MutationObsType.customChange,
                config: { attributes: true, attributeFilter: ["id"] }
            });

            c2._observerCallBack = function (ms) {
                var t = GetVideoRegex(vimeoInfo.videoRegexVimeoCOG);
                var m = t.exec(location.href);
                if (m && m.length > 5) {
                    var pageContainer = document.querySelector('.player_container');
                    var childEle = document.querySelector('.player_container > div');

                    if (!childEle) {
                        return;
                    }

                    var vid = childEle.id;
                    var btn = pageContainer.querySelector(pinstream.PinBtnCSSName)
                    if (btn && vid) {
                        btn.dataset.vid = vid;
                        btn.dataset.url = pinstream.GetVimeoUrlById(vid);
                        btn.title = btn.dataset.url;
                    }
                }
                // console.info(location.href)
            }

            c2.run();
        });

    }

    var menuContainer = document.querySelectorAll('.search_filter_menu');
    if (menuContainer && menuContainer.length) {
        var c = new CreateMutationObs({
            target: document.querySelector('.iris_p_infinite__grid'),
            type: pinstream.MutationObsType.childList
        });

        c._observerCallBack = function (ms) {
            var homeVideos = document.querySelectorAll('.wrap_content .iris_video-vital > a');
            if (homeVideos) {
                AddButtonToTarget(homeVideos);
                homeVideos.forEach(function (item) {
                    var c = new CreateMutationObs({
                        target: item,
                        type: pinstream.MutationObsType.customChange,
                        config: { attributes: true, attributeFilter: ["href"] }
                    });
                    c._observerCallBack = function (ms) {
                        updateButton(item)
                    };
                    c.run();
                })
            }
        }

        c.run();
    }

    //todo test https://vimeo.com/ondemand/desertrunners
    // var similarContainer = document.querySelectorAll('#wrap .similar-titles-wrap a');
    // if (similarContainer && similarContainer.length) {
    //     AddButtonToTarget(similarContainer)
    // }

    // console.info('run vimeo')
})();