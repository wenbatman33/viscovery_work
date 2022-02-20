document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('btn-clear-list').addEventListener('click', function () {
		chrome.storage.local.clear();
		window.location.reload();
	})

	chrome.storage.local.get("List", function (result) {
		var v = document.getElementById("video-list");
		if (result && result.List) {
			var items = [];
			var data = result.List;
			data.forEach(function (item, index) {
				items += '<li><a target="_blank" href="' + chrome.extension.getURL("playvideo.html") + '?id=' + item.id + '&webSite=' + item.webSite + '"/>[' + item.webSite + "] " + item.title + '<a></li>'
			})
			v.innerHTML = '<ul>' + items + '</ul>'
		}

	})
})