// background.js

// Called when the user clicks on the browser action.
function GetDate(){
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  newdate = year + "/" + month + "/" + day;
  return newdate
}
function GetDiff(d1,d2){
  var date1 = new Date(d1);
  var date2 = new Date(d2);
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
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
  //chrome.windows.getAll(function(win_list){
    chrome.storage.sync.get('extensionDate', function(result){
      if (GetDiff(result.extensionDate,GetDate()) === 0){ //&& win_list.length === 1
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var activeTab = tabs[0];
          console.log(activeTab);
          chrome.webRequest.onBeforeSendHeaders.addListener(handler, requestFilter, extraInfoSpec);
          chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
        });
      chrome.storage.sync.set({'extensionDate': GetDate()}, function() {
        console.log("Updated collection time to "+GetDate())  
      });
     }
   })
  //});
  cleanup();
}
var myfunc = function() {
  chrome.storage.sync.get('extensionDate', function(result){
    console.log("The old collection time is "+result.extensionDate)
    console.log("The current time is "+GetDate())
    console.log(GetDiff(result.extensionDate,GetDate()) === 0)
    chrome.tabs.onUpdated.addListener(dummy);
    /*if (GetDiff(result.extensionDate,GetDate()) === 0){//(result.extensionDate !== GetDate()) { //need to decide on the next snapshot time lapse
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var activeTab = tabs[0];
          console.log(activeTab);
          chrome.webRequest.onBeforeSendHeaders.addListener(handler, requestFilter, extraInfoSpec);
          chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
        });
      chrome.storage.sync.set({'extensionDate': GetDate()}, function() {
        console.log("Updated collection time to "+GetDate())  
      });
    }*/
  })

}
chrome.windows.onCreated.addListener(myfunc);

var cleanup = function() {
    chrome.windows.onCreated.removeListener(myfunc);
    chrome.tabs.onUpdated.removeListener(dummy);
}


// This block is new!
/*chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }
  }
);*/