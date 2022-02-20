(function () {

    chrome.runtime.onMessage.addListener(function (msg, sss, sendResponse) {
        document.dispatchEvent(new CustomEvent('d_extension_event', { detail: true }))
    });

    document.addEventListener('d_add_event', function (e) {
        pinstream.OnSaveDailyMotionInfo(e.detail.url, e.detail.vid)
        // console.info(e.detail)
    })
}());