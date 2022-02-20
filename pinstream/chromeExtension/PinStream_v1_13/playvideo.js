function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

document.addEventListener('DOMContentLoaded', function () {
  var info = {
    webSite: getParameterByName('webSite'),
    id: getParameterByName('id')
  }
  var ifvideo = document.getElementById('ifvideo');
  if (!info.id || !info.webSite) {
    return;
  }

  if (info.webSite == "fb") {
    chrome.storage.local.get("List", function (result) {
      if (result.List) {
        var d = result.List;
        var r = d.filter(function (item) { return item.id == info.id && item.webSite == info.webSite })
        if (r && r.length) {
          ifvideo.src = r[0].videoUrl;
        }
      }
    })
  } else if (info.webSite == "youtube") {
    ifvideo.src = pinstream.ServerHost + '/youtube/' + info.id;
  }
});
