function OpenManagement() {
    chrome.tabs.create({
        url: pinstream.ManagementUrl(),//chrome.extension.getURL("Management.html"),
        selected: true
    })
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("my-management").addEventListener("click", function () {
        OpenManagement()
    });
});
