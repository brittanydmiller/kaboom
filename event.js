// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
function injectedMethod (tab, method, callback) {
  chrome.tabs.executeScript(tab.id, { file: 'inject.js' }, function(){
    chrome.tabs.sendMessage(tab.id, { method: method }, callback);
  });
}


function filterCandidates(tab){
 // When we get a result back from the filterCandidates
  injectedMethod(tab, 'filterCandidates', function (response) {
    var stuff = response.data;
    alert(stuff);
    return true;
  });

}

chrome.browserAction.onClicked.addListener(filterCandidates);
