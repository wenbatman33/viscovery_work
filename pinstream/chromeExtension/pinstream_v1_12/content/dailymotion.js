(function () {
    'use strict';
    var obsType = {
        attrStyle: 'attr-style',
        childList: 'child',
        customChange: 'c'
    };

    var pinClassName = '.pin-button';

    var dailymotionInfo = {
        videoRegexDailymotionDefault: 'dailymotion-default',
        embedUrlDailymotion: 'dailymotion'
    }

    function GetVideoRegex(type) {
        switch (type) {
            case dailymotionInfo.videoRegexDailymotionDefault:
                return /^.+dailymotion.com\/(?:video|swf\/video|embed\/video|hub|swf)\/([^&?_]+)/i;
        }
    }

    function GetEmbedUrl(type, vid) {
        switch (type) {
            case dailymotionInfo.embedUrlDailymotion:
                return `https://www.dailymotion.com/embed/video/${vid}`
        }
    }

    function GetMatchResult(regex, elementUrl) {
        this._elementUrl = elementUrl;
        this._regex = regex;

        if (!this._regex) {
            throw 'regex undefined'
        }

        if (!this._elementUrl) {
            throw 'elementUrl undefined'
        }

        try {
            var m = this._regex.exec(this._elementUrl);

            if (m && m.length) {
                return m;
            }
        } catch (error) {
            console.info(error)
        }

        return null;
    }

    /** @description set PinVideoButton
    * @param {object} opts element、vidIndex、embedType、regexType、elementUrl
    */
    function PinVideoButtonModel(opts) {
        opts = opts || {};
        this._element = opts.element;
        this._vidIndex = opts.vidIndex || 0;
        this._embedType = opts.embedType;

        this.vid = '';
        this.url = '';

        if (!this._element) {
            throw 'element undefined'
        }

        if (!this._embedType) {
            throw 'embedType undefined'
        }

        if (this._element.parentNode.querySelector(pinClassName)) {
            return;
        }

        var m = new GetMatchResult(GetVideoRegex(opts.regexType), opts.elementUrl);

        if (m == null && m.length < this._vidIndex) {
            return;
        }

        this.vid = m[this._vidIndex];

        if (this.vid) {
            this.url = GetEmbedUrl(this._embedType, this.vid);
            this._element.parentNode.insertBefore(createButton(this.url, this.vid), this._element);
            addmouseEvent(this._element, false);
            return createButton(this.url, this.vid);
        }
    }

    //listener extension event
    document.addEventListener('d_extension_event', function (e) {
        if (e.detail) {
            channelPageInit()
            onObserver()
        }
    })

    function AddButtonToIframe(iframeEle) {
        setTimeout(function () {
            var playbox = iframeEle.contentDocument.querySelector('#playerv5_box')
            if (playbox) {
                var pbtn = new PinVideoButtonModel({
                    element: playbox,
                    vidIndex: 1,
                    embedType: dailymotionInfo.embedUrlDailymotion,
                    regexType: dailymotionInfo.videoRegexDailymotionDefault,
                    elementUrl: iframeEle.src
                });

                if (pbtn) {
                    var btn = playbox.parentElement.querySelector(pinClassName)
                    var imgUrl = localStorage.getItem('imgurl');
                    btn.style = `opacity:0;
                                width: 34px;
                                height: 34px;
                                margin: 0;
                                padding: 0;
                                position: absolute;
                                border: 1px solid #d3d3d3;
                                border-radius: 2px;
                                background: #f8f8f8 url('${imgUrl}') no-repeat;
                                cursor: pointer;
                                z-index: 999;`
                }
            } else {
                AddButtonToIframe(iframeEle);
            }
        }, 1000)
    }

    //history page
    var mediaListHistory = document.querySelectorAll('#content div.media a.preview_link')
    if (document.querySelectorAll('#content div.media')) {
        mediaListHistory.forEach(function (mItem, mIndex) {
            var pbtn = new PinVideoButtonModel({
                element: mItem,
                vidIndex: 1,
                embedType: dailymotionInfo.embedUrlDailymotion,
                regexType: dailymotionInfo.videoRegexDailymotionDefault,
                elementUrl: mItem.href
            });
        })
    }

    //home page recommend sitebar item
    var mediaListSiteBar = document.querySelectorAll('#content .sidebar .trending_videos .media a');
    if (mediaListSiteBar) {
        mediaListSiteBar.forEach(function (mItem, mIndex) {
            var pbtn = new PinVideoButtonModel({
                element: mItem,
                vidIndex: 1,
                embedType: dailymotionInfo.embedUrlDailymotion,
                regexType: dailymotionInfo.videoRegexDailymotionDefault,
                elementUrl: mItem.href
            });
        })
    }

    function OnHomePageRecommend() {
        //home page recommend main item
        var mediaList = document.querySelectorAll('#content .main-container .media');
        if (mediaList) {
            mediaList.forEach(function (mItem, mIndex) {
                var vid = mItem.dataset.video;
                if (mItem.children && mItem.children.length > 0 && vid) {
                    var childDiv = mItem.children[0];
                    if (childDiv.parentNode.querySelector(pinClassName)) {
                        return;
                    }
                    var btn = createButton(GetEmbedUrl(dailymotionInfo.embedUrlDailymotion, vid), vid);
                    mItem.insertBefore(btn, childDiv);
                    addmouseEvent(childDiv, false)
                }
            })
        }
    }

    OnHomePageRecommend();

    //click more the home page recommend item 
    if (document.querySelector('#content .main-container div')) {
        var c = new CreateMutationObs({ target: document.querySelector('#content .main-container div'), type: obsType.childList })
        c._observerCallBack = function (ms) {
            OnHomePageRecommend();
        }
        c.run();
    }

    //click more the home page feed item 
    if (document.querySelector('#content .pl_following_page')) {
        var c = new CreateMutationObs({ target: document.querySelector('.pl_following_page'), type: obsType.childList })
        c._observerCallBack = function (ms) {
            OnHomePageFeed();
        }
        c.run();
    }

    function OnHomePageFeed() {
        //home page feed item
        var mediaListFeed = document.querySelectorAll('#content .feed-item .media div.media-img');
        if (mediaListFeed) {
            mediaListFeed.forEach(function (mItem, mIndex) {
                var vid = mItem.dataset.id;
                if (mItem.children && mItem.children.length > 0) {
                    var childDiv = mItem.children[0];
                    if (childDiv.parentNode.querySelector(pinClassName)) {
                        return;
                    }
                    var btn = createButton(GetEmbedUrl(dailymotionInfo.embedUrlDailymotion, vid), vid);
                    mItem.insertBefore(btn, childDiv);
                    addmouseEvent(childDiv, false)
                }
            })
        }
    }

    OnHomePageFeed();

    // playlist 
    // document.querySelector('#player_container #playerv5_box');
    // /(http|https):\/\/www.dailymotion.com\/playlist\/([^&?_]+).+\/.+#video=([^&?_]+)/i;
    // m[3]
    // test page http://www.dailymotion.com/playlist/x36th2_wordpresswave_wordpress-plugins/1#video=x1tsdp8

    //playlist page main
    var playListContainer = document.querySelector('#player_container');
    if (playListContainer && document.querySelector('#player_container #playerv5_box')) {
        var c = new CreateMutationObs({ target: playListContainer, type: obsType.childList });
        c._observerCallBack = function (ms) {
            var iframeEle = document.querySelector('#player_container iframe#playerv5-iframe');
            if (iframeEle) {
                var pbtn = new PinVideoButtonModel({
                    element: iframeEle,
                    vidIndex: 1,
                    embedType: dailymotionInfo.embedUrlDailymotion,
                    regexType: dailymotionInfo.videoRegexDailymotionDefault,
                    elementUrl: iframeEle.src
                });

                var ifc = new CreateMutationObs({
                    target: iframeEle, type: obsType.customChange, config: {
                        attributes: true, attributeFilter: ["src"]
                    }
                })

                ifc._observerCallBack = function (ms) {
                    if (ms && ms.length) {
                        var iframeEle = ms[0].target;
                        var t = GetVideoRegex(dailymotionInfo.videoRegexDailymotionDefault);
                        var m = t.exec(iframeEle.src);
                        if (!m || m.length < 1) {
                            return;
                        }
                        //update button info
                        var vid = m[1];
                        var btn = iframeEle.parentElement.querySelector(pinClassName);
                        btn.dataset.vid = vid;
                        btn.dataset.url = GetEmbedUrl(dailymotionInfo.embedUrlDailymotion, vid);
                    }
                }
                ifc.run();
            }
        }
        c.run();
    }

    //playlist page side
    var playListSidebar = document.querySelector('#video_relatedlist');
    if (playListSidebar) {
        var c = new CreateMutationObs({ target: playListSidebar, type: obsType.childList });
        c._observerCallBack = function (ms) {
            var videoElements = document.querySelectorAll('#video_relatedlist .related_list a');
            if (videoElements && videoElements.length) {
                videoElements.forEach(function (vItem, vIndex) {
                    var pbtn = new PinVideoButtonModel({
                        element: vItem,
                        vidIndex: 1,
                        embedType: dailymotionInfo.embedUrlDailymotion,
                        regexType: dailymotionInfo.videoRegexDailymotionDefault,
                        elementUrl: vItem.href
                    });
                })
            }
        }
        c.run();
    }

    //player http://www.dailymotion.com/video/xxxx page main
    var playercontainer = document.querySelector('.player-container #playerv5_box')
    if (playercontainer) {
        var pbtn = new PinVideoButtonModel({
            element: playercontainer,
            vidIndex: 1,
            embedType: dailymotionInfo.embedUrlDailymotion,
            regexType: dailymotionInfo.videoRegexDailymotionDefault,
            elementUrl: location.href
        });
    }

    //player http://www.dailymotion.com/video/xxxx page side
    if (document.querySelector('#related')) {
        var c = new CreateMutationObs({ target: document.querySelector('#related'), type: obsType.childList })
        c._observerCallBack = function (ms) {
            var videoElements = document.querySelectorAll('#related .related_list a.row');
            if (videoElements && videoElements.length) {
                videoElements.forEach(function (vItem, vIndex) {
                    var pbtn = new PinVideoButtonModel({
                        element: vItem,
                        vidIndex: 1,
                        embedType: dailymotionInfo.embedUrlDailymotion,
                        regexType: dailymotionInfo.videoRegexDailymotionDefault,
                        elementUrl: vItem.href
                    });
                })
                //todo 
                //c.close();
            }
        }
        c.run();
    }

    //channel home Page check iframe and add button
    document.addEventListener('load', function () {
        var iframeEle = document.querySelector('.player iframe');
        if (iframeEle) {
            var pbtn = new PinVideoButtonModel({
                element: iframeEle,
                vidIndex: 1,
                embedType: dailymotionInfo.embedUrlDailymotion,
                regexType: dailymotionInfo.videoRegexDailymotionDefault,
                elementUrl: iframeEle.src
            });
        }
    }, true)

    function createButton(link, vid) {
        var button = document.createElement('button');
        button.className = 'pin-button';
        button.dataset.url = link;
        button.dataset.vid = vid;
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            event.cancelBubble = true;
            var url = this.dataset.url;
            var vid = this.dataset.vid;
            document.dispatchEvent(new CustomEvent('d_add_event', {
                detail: {
                    url: url,
                    vid: vid
                }
            }))
        })
        return button;
    }

    function addmouseEvent(targetElement, isParentElement = true) {        
        //todo after modify
        if (isParentElement) {
            targetElement.parentNode.addEventListener('mouseover', function () {
                this.parentElement.querySelector(pinClassName).style.opacity = 0.9;
            });

            targetElement.parentNode.addEventListener('mouseleave', function () {
                this.parentElement.querySelector(pinClassName).style.opacity = 0;
            });
        } else {
            targetElement.parentNode.addEventListener('mouseover', function () {
                this.querySelector(pinClassName).style.opacity = 0.9;
            });

            targetElement.parentNode.addEventListener('mouseleave', function () {
                this.querySelector(pinClassName).style.opacity = 0;
            });
        }
    }

    function CreateMutationObs(options) {

        this._target = options.target;

        if (!this._target) {
            throw '_target undefined'
        }

        this._observerCallBack = function (mutation) { console.info(mutation) }

        this._observer = new MutationObserver(function (mutation) {
            this._observerCallBack(mutation);
        }.bind(this));

        if (!options.type) {
            throw 'type undefined'
        }

        switch (options.type) {
            case obsType.attrStyle:
                this._config = { attributes: true, attributeFilter: ["style"] };
                break;
            case obsType.childList:
                this._config = { childList: true };
                break;
            case obsType.customChange:
                this._config = options.config;
                break;
            default:
                throw '_config undefined'
                break;
        }

        this.run = function () {
            this._observer.observe(this._target, this._config);
        }

        this.close = function () {
            this._observer.disconnect();
        }
    }

    var temp1 = [];
    var temp2 = [];

    //channel home Page click dropdownlist and more event
    function onObserver() {
        var target2 = document.querySelectorAll('.video-list > div:first-child')

        if (target2 && target2.length > 0) {
            target2.forEach(function (t2Item, t2Index) {
                if (temp2[t2Index] === undefined || temp2[t2Index]._target !== t2Item) {
                    var c = new CreateMutationObs({ target: t2Item, type: obsType.childList });
                    c._observerCallBack = function (ms) {
                        //todo add button fail
                        channelPageInit()
                    }
                    c.run();
                    temp2.push(c);
                }
            })

            var target1 = document.querySelectorAll('.video-list div[style*="background-image"]')
            if (target1 && target1.length > 0) {
                temp1.forEach(function (item) {
                    item.close();
                });
                temp1 = [];
                target1.forEach(function (t1Item) {
                    var c = new CreateMutationObs({ target: t1Item, type: obsType.attrStyle });
                    c._observerCallBack = function (ms) {
                        ms.forEach(function (m) {
                            var r = ReactDOM.findDOMNode(m.target.parentElement.parentElement.parentElement)
                            var nodeInstance = r[Object.keys(r)[0]]
                            if (nodeInstance && nodeInstance._currentElement !== undefined
                                && nodeInstance._currentElement.props && nodeInstance._currentElement.props.hasOwnProperty('children')) {
                                if (m.target.parentElement.querySelector(pinClassName)) {
                                    m.target.parentElement.querySelector(pinClassName).remove();
                                }
                                var vid = nodeInstance._currentElement.props.children.props.id;
                                var btn = createButton(GetEmbedUrl(dailymotionInfo.embedUrlDailymotion, vid), vid);
                                m.target.parentNode.insertBefore(btn, m.target);
                                addmouseEvent(m.target.parentElement, false)
                            }
                        });
                    }
                    c.run();
                    temp1.push(c);
                })
            }
        }
    }

    //channel home Page add button [React]
    function channelPageInit() {
        if (window.ReactDOM !== undefined) {
            var d = document.querySelectorAll('.video-list');
            // console.info('run dailymotion onMessage.addListener')
            d.forEach(function (v, i) {
                var r = ReactDOM.findDOMNode(v.querySelector('div'));
                if (r !== undefined) {
                    var nodeInstance = r[Object.keys(r)[0]]
                    if (nodeInstance && nodeInstance._currentElement !== undefined) {
                        var nodeElement = nodeInstance._currentElement;
                        if (nodeElement.hasOwnProperty('props')) {
                            var p = nodeInstance._currentElement.props
                            if (p !== undefined && p.hasOwnProperty('children')) {
                                if (p.className == 'video-list-area' && p.children && p.children.length) {
                                    var divImgs = r.querySelectorAll('div[style*="background-image"]')
                                    if (divImgs && divImgs.length) {
                                        divImgs.forEach(function (divImgItem) {
                                            if (divImgItem.parentElement.querySelector(pinClassName)) {
                                                return;
                                            }
                                            var pinfo = p;
                                            var backgroundImgurl = divImgItem.style.backgroundImage.replace('url("', '').replace('")', '');
                                            var r = pinfo.children.filter(function (item) {
                                                return item.props && item.props.thumbnail_240_url && item.props.thumbnail_240_url === backgroundImgurl;
                                            })
                                            if (r && r.length) {
                                                var firstItem = r[0];
                                                var vid = firstItem.props.id;
                                                var btn = createButton(GetEmbedUrl(dailymotionInfo.embedUrlDailymotion, vid), vid);
                                                divImgItem.parentNode.insertBefore(btn, divImgItem);
                                                addmouseEvent(divImgItem.parentElement, false)
                                            }
                                        })
                                    }
                                } else {
                                    if (p !== undefined && p.hasOwnProperty('children') && p.children.length) {
                                        var divImgs = r.querySelectorAll('div[style*="background-image"]')
                                        if (divImgs && divImgs.length) {
                                            divImgs.forEach(function (divImgItem) {
                                                if (divImgItem.parentElement.querySelector(pinClassName)) {
                                                    return;
                                                }
                                                var pinfo = p;
                                                var backgroundImgurl = divImgItem.style.backgroundImage.replace('url("', '').replace('")', '');
                                                var r = pinfo.children.filter(function (item) {
                                                    return item.props && item.props.children && item.props.children.props && item.props.children.props.thumbnail_240_url && item.props.children.props.thumbnail_240_url === backgroundImgurl;
                                                })
                                                if (r && r.length) {
                                                    var firstItem = r[0];
                                                    var vid = firstItem.props.children.props.id;
                                                    var btn = createButton(GetEmbedUrl(dailymotionInfo.embedUrlDailymotion, vid), vid);
                                                    divImgItem.parentNode.insertBefore(btn, divImgItem);
                                                    addmouseEvent(divImgItem.parentElement, false)
                                                }
                                            });
                                        }
                                    }
                                }
                            } else {
                                console.info('not found')
                            }
                        }
                    }
                }
            })
        } else {
            window.setTimeout(channelPageInit, 100);
        }
    }

    // console.info('run dailymotion')
})();