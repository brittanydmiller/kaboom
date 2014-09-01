// This helps avoid conflicts in case we inject 
// this script on the same page multiple times
// without reloading.
var injected = injected || (function(){

  // An object that will contain the "methods"
  // we can use from our event script.
  var methods = {};

  methods.contains = function(array, target) {
    var j = array.length;
    while (j--) {
      if (array[j] === target) {
        return true;
      }
    }
    return false;
  };

  methods.parseCurrentTitle = function(vCard){
    var titleWords = "" ;
    if (vCard[1].children[1].className == "title") {
      var titleWords = vCard[1].children[1].innerText;
    }
    var currentJobWords = vCard[3].children[1].children[0].innerText;
    var isolatedWords = methods.toJustWords(titleWords).concat(methods.toJustWords(currentJobWords));
    isolatedWords = methods.eliminateDupes(isolatedWords);
    return isolatedWords;
  };

  methods.toJustWords = function(data) {
    var words = data.toLowerCase()
      .replace(/['!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g,"")
      .split(" ");
    words = methods.removeCompany(words, "at");
    return words;
  };

  methods.eliminateDupes = function(arr) {
    var i,
        len=arr.length,
        out=[],
        obj={};

    for (i=0;i<len;i++) {
      obj[arr[i]]=0;
    }
    for (i in obj) {
      out.push(i);
    }
    return out;
  };

  methods.removeCompany = function(wordsArray, target){
    if (methods.contains(wordsArray, "at")) {
      //chops off second line of current postion data, as customer requested.
      var sliceTarget = wordsArray.indexOf("at");
      return wordsArray.slice(0, sliceTarget);
    } else {
    return wordsArray;
    }
  };

  methods.lowQuality = function(jobTitle){
    var badTitles = ["intern", "contractor", "contract", "consultant", "consulting", "self-employed", "self employed", "junior", "jr", "jr.", "freelance", "freelancer", "student", "founder", "CTO", "CEO", "co-founder", "ta"]
    //var badCompanies = ["self employed", "freelance", "self-employed"];
    for ( k in badTitles ) {
      if ( methods.contains(jobTitle, badTitles[k]) ) {
        return true;
      }  
    }
    return false;
  };

  methods.filterCandidates = function(){
    var urls = [];
    var profiles = document.querySelectorAll("li.results-item.profile");

    for (var i = 0; i < profiles.length; i ++) {
      var vCard = profiles[i].children[1].children[2].children;
      var viewedAlready = vCard[2].children[0];
      var jobTitle = methods.parseCurrentTitle(vCard);
      var profileLink = vCard[0].children[0].getAttribute("href")
      
      if (viewedAlready) {
        profiles[i].style.display = "none";
      } else if ( methods.lowQuality(jobTitle) ) {
        profiles[i].style.display = "none";
      } else { 
        urls.push(profileLink);       
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
