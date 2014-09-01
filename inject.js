// This helps avoid conflicts in case we inject 
// this script on the same page multiple times
// without reloading.
var injected = injected || (function(){

  // An object that will contain the "methods"
  // we can use from our event script.
  var methods = {};

  methods.filterCandidates = function(){
    var urls = [];
    var profiles = document.querySelectorAll("li.results-item.profile");

    for (var i = 0; i < profiles.length; i ++) {
      var vCard = profiles[i].children[1].children[2].children;
      var viewedAlready = vCard[2].children[0];
      
      if (viewedAlready) {
        profiles[i].style.display = "none";
        console.log("seen already");
      } else { 
        console.log("possibily good")       
      }
    }
    return urls;
  };

  // This tells the script to listen for
  // messages from our extension.
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};
    // If the method the extension has requested
    // exists, call it and assign its response
    // to data.
    if (methods.hasOwnProperty(request.method))
      data = methods[request.method]();
    // Send the response back to our extension.
    sendResponse({ data: data });
    return true;
  });

  return true;
})();
