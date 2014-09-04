// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
function injectedMethod (tab, method, callback) {
  chrome.tabs.executeScript(tab.id, { file: 'inject.js' }, function(){
    chrome.tabs.sendMessage(tab.id, { method: method }, callback);
  });
}

function filterCandidates(tab){
 // When we get a result back from the filterCandidates, open in a new tab (& return true?)
  injectedMethod(tab, 'filterCandidates', function (response) {
    var urls = response.data;
    if (urls && urls.length) {
      for (i in urls) {
        var url = urls[i]
        chrome.tabs.create({ url: url });
      }  
    } else {
      alert("no good ones");
    }
    return true;
  });
}

chrome.browserAction.onClicked.addListener(filterCandidates);
