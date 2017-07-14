// background.js
// Called when the user clicks on the browser action.
var checker = true;
var timeGap = 0;
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
  console.log(d1)
  console.log(d2)
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
  chrome.storage.sync.get('extensionDate', function(result){
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
  chrome.tabs.onUpdated.addListener(dummy);
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "ALL DONE" ) {
      chrome.storage.sync.set({'extensionDate': GetDate()}, function() {
        console.log("ALL DONE. Updated collection time to "+GetDate())  
        chrome.tabs.onUpdated.removeListener(dummy);
        checker = false;
      });
    }
  }
);
