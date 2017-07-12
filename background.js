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
/*chrome.windows.getAll({"populate" : true}, function(myarr){
  console.log(myarr)
})*/
chrome.storage.sync.get('extensionDate', function(result){
  console.log("The old collection time is "+result.extensionDate)
  console.log("The current time is "+GetDate())
  if (result.extensionDate !== GetDate()) { //need to decide on the next snapshot time lapse
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){  
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
      });
    });
    chrome.storage.sync.set({'extensionDate': GetDate()}, function() {
      console.log("Updated collection time to "+GetDate())  
    });
  }
})


// This block is new!
/*chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }
  }
);*/