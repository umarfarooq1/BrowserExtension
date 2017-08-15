//points to remember. On startup of background send the extension date parameter to content.js. If it doesnt exist send the default value that 
//hints at scraping data for the past six months. Otherwise send the date of last snapshot so that data from there onwards is scraped.
// background.js
// Called when the user clicks on the browser action.
var checker = true;
var timeGap = 0; //ensure this is set to the desired value before the extension is deployed
var responses = 0;
var toServer = {}
function GetDate(){
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  newdate = year + "/" + month + "/" + day;
  return newdate
}
function GetDiff(d1){
  var d2 = GetDate();
  var date1 = new Date(d1);
  var date2 = new Date(d2);
  var timeDiff = date2.getTime() - date1.getTime();
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  return diffDays;
}

/*chrome.windows.getAll({"populate" : true}, function(myarr){
  console.log(myarr)
})*/
var requestFilter = {
    urls: ["<all_urls>"]
},

extraInfoSpec = ['requestHeaders', 'blocking'],
handler = function(details) {
  var isRefererSet = false;
  var headers = details.requestHeaders,
      blockingResponse = {};

  for (var i = 0, l = headers.length; i < l; ++i) {
      if (headers[i].name == 'Referer') {
          headers[i].value = "http://www.bluekai.com/registry";
          isRefererSet = true;
          break;
      }
  }

  if (!isRefererSet) {
      headers.push({
          name: "Referer",
          value: "http://www.bluekai.com/registry"
      });
  }

  blockingResponse.requestHeaders = headers;
  return blockingResponse;
};

var dummy = function(tabId, changeInfo, tab){
  chrome.storage.sync.get('extensionDate', function(result){ //need to add exception if "extensionDate" variable doesnt exist
    console.log(result)
    if (GetDiff(result.extensionDate) >= timeGap && checker){ //&& win_list.length === 1
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        console.log(activeTab);
        chrome.webRequest.onBeforeSendHeaders.addListener(handler, requestFilter, extraInfoSpec);
        if(activeTab.status ==="complete"){
          chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});  
        }
      });
   }
 })
}


//chrome.windows.onCreated.addListener(myfunc);
chrome.runtime.onStartup.addListener(function() {
  console.log('this is startup..')
  chrome.tabs.onUpdated.addListener(dummy);
});

var BrowsingHist = new Promise (function(resolve,reject) {
  var dateCurrent= new Date() 
  var correction = dateCurrent.getTimezoneOffset()*60*1000;
  var dN = Date.now() 
  var d1 = dN%86400000
  var b = correction + dN - d1
  var a = b - 86400000;
  if (timeGap!==0){
    var a = b - timeGap*86400000;
  }
  chrome.history.search({text: '', startTime: a, endTime:b,maxResults: 100000}, function(data) {
    resolve(data)
  });
})
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponsse) {
    //if(request.text === "what is my tab_id?"){
      //console.log(sender.tab.id)
    //}
    if( request.message === "ALL DONE") {
      responses++;
      toServer[request.type] = request.data
    }
    if (responses === 3) { //need to set this threshold,currently waiting for four responses. 0,1,2,3
      chrome.storage.sync.set({'extensionDate': GetDate()}, function() {
        BrowsingHist.then(function(data){
          toServer['BrowsingHistory'] = data;
          //console.log(new Set(toServer.googleSearchTerms))
          console.log(toServer)
          console.log(sender.tab.id)
          console.log("ALL DONE. Updated collection time to "+GetDate())
        })
        chrome.tabs.onUpdated.removeListener(dummy);
        checker = false;
      });
    }
  }
);
