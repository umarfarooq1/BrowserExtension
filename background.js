//points to remember. On startup of background send the extension date parameter to content.js. If it doesnt exist send the default value that 
//hints at scraping data for the past six months. Otherwise send the date of last snapshot so that data from there onwards is scraped.
// background.js
// Called when the user clicks on the browser action.
var checker = true;
var timeGap = 7; //ensure this is set to the desired value before the extension is deployed, zero corresponds to one day history of the previous day!
var responses = 0;
var toServer = {}
var firstTime = false
var firstTab = false
var complete = false

var myPopUp = -1;
loggedInfb = false;
loggedInGoogle = false;
//var startUp = false
GOOGLE_SEARCH = []
a = 0;
b = 0;
Googlecomplete = false;
check1 = true
check2 = true
check3 = true
check4 = true
check5 = true
check6 = true
NumberofDaysToGoBackForGoogleSearch = 30 //collects a month worth of data. Problem is that sendmore doesnt break precisely on the 30th day mark, 
                                        //can end on 40th day. Since response received in bulk
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


chrome.webRequest.onBeforeSendHeaders.addListener(handler, requestFilter, extraInfoSpec);
      
function update_GoogleSearchBUNDLES(all){
  var arr = [];
  if(all!==undefined){
  	for (var i=0; i <all.length ; i++) {
	    sub = all[i][9]
	    sub.push(all[i][4]); //consider timezone, for pakistan this becomes GMT+05:00
	    GOOGLE_SEARCH.push(sub)  
	  }	
  }
  b++;
  if(a===b && Googlecomplete == true){
      Finalize({"message": "ALL DONE","data":GOOGLE_SEARCH, "type":"googleSearchTerms"});
  }
}
function sendMoreBundles(bundle){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "https://myactivity.google.com/bundle-details?utm_source=my-account&utm_medium&utm_campaign=my-acct-promo&jspb=2&jspb=1", true);
  xhr.onerror = function(e){
    console.log("error?")
  	Finalize({"message": "ALL DONE","data":GOOGLE_SEARCH,"Error":"error encountered with responseText = "+e.currentTarget.responseText, "type":"googleSearchTerms"});
  }
  xhr.onreadystatechange = processGoogleSearchRequestBundles;
  xhr.send(JSON.stringify({"bundle":bundle}));

}
function processGoogleSearchRequestBundles(e) {   
  if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
    var response = e.currentTarget.responseText;
    if(e.currentTarget.responseURL.indexOf('myactivity.google.com')!== -1){
       response = response.split("\n")[1]
       var tmp = response
       var ar = eval(tmp);
       var all = ar[0];
       update_GoogleSearchBUNDLES(all)
    }       
  }
}
function update_GoogleSearch(all){
  var arr = [];
  if (all!==undefined){
    for (var i=0; i <all.length ; i++) {
      var sub = all[i][1];
      for (var x=0; x<sub.length ; x++) {
        var sub1 = sub[x][1][2];
        sendMoreBundles(sub[x][1][3])
        a++;
      }
    }
  }
}
function sendMore(ct){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "https://myactivity.google.com/myactivity?utm_source=my-account&utm_medium&utm_campaign=my-acct-promo&jspb=1", true);
  xhr.onerror = function(e){
  	Finalize({"message": "ALL DONE","data":GOOGLE_SEARCH,"Error":"error encountered with responseText = "+e.currentTarget.responseText, "type":"googleSearchTerms"});
  }
  xhr.onreadystatechange = processGoogleSearchRequest;
  xhr.send(JSON.stringify({"ct":ct}));
}
function processGoogleSearchRequest(e) {      
  if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
    var response = e.currentTarget.responseText;
    if(e.currentTarget.responseURL.indexOf('myactivity.google.com')!== -1){
       response = response.split("\n")[1]
       var tmp = response//.slice(6);
       var ar = eval(tmp);
       var all = ar[0];
       if(all!==undefined){
        update_GoogleSearch(all)
         if(GetDiff(Math.floor(ar[0][0][0]/1000)) > NumberofDaysToGoBackForGoogleSearch){
           console.log("pokerface")
           Googlecomplete = true
         }
         else{
          sendMore(ar[1]);
         }
       }
       else{
        Googlecomplete = true
       }
    }       
  }
}

chrome.cookies.onChanged.addListener(function(info) {
  var cookie1 = JSON.stringify(info)
  // checking if signed into google
     if(cookie1.indexOf("accounts.google.com") !== -1 && cookie1.indexOf("LSID") !== -1){
        // console.log(cookie1);
    // console.log()
        if(info.removed === true){
            loggedInGoogle = false;
            console.log("naay  G :(");
        } else {
            loggedInGoogle = true;
            console.log("yaay G");    
        }

        if(myPopUp !== -1)
              chrome.tabs.sendMessage(myPopUp, {"type":"logStatus" ,"msgfb": loggedInfb, "msgg": loggedInGoogle});  
    }
    // checking if signed into fb 
    if(cookie1.indexOf("facebook.com") !== -1 && cookie1.indexOf("c_user") !== -1){
        // console.log(cookie1);
        if(info.removed === true){
            loggedInfb = false;
            console.log("naay  fb :(");
        } else {
            loggedInfb = true;
            console.log("yaay fb");
        } 

        if(myPopUp !== -1)
              chrome.tabs.sendMessage(myPopUp, {"type":"logStatus" ,"msgfb": loggedInfb, "msgg": loggedInGoogle});
    }
});

function logStatus(){
  chrome.cookies.get({url:'https://accounts.google.com', name:'LSID'}, function(cookie) {
    if (cookie) {
        // console.log('Sign-in cookie:', cookie);
        loggedInGoogle = true;
    }
    else{
        // console.log("not signed in")
        loggedInGoogle = false;
    }
  });
  chrome.cookies.get({url:'https://facebook.com', name:'c_user'}, function(cookie) {
    if (cookie) {
        // console.log('Sign-in cookie:', cookie);
        loggedInfb = true;
    }
    else{
        // console.log("not signed in")
        loggedInfb = false;
    }
  });
  chrome.tabs.sendMessage(myPopUp, {"type":"logStatus" ,"msgfb": loggedInfb, "msgg": loggedInGoogle});
}

chrome.runtime.onInstalled.addListener(function(){
  chrome.storage.sync.set({'extensionDate': GetDate()}, function() {console.log('setting extensionDate variable')})                        
  firstTime = true
  console.log("I have installed the extension for the first time")
  chrome.tabs.create({
    url: chrome.extension.getURL('sur.html'),
    active: true
  }, function(tab) {
      myPopUp = tab.id;
      logStatus();
    });
});
p = 0;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type == "init"){
      chrome.tabs.sendMessage(myPopUp, {"type":"logStatus" ,"msgfb": loggedInfb, "msgg": loggedInGoogle});
    }
    if(request.type == "dataCollection"){
      Start({"message": "clicked_browser_action"}); 
    }
    if(request.type == "sendToMe"){
      console.log(sender); 
      console.log(toServer['survey']);
      chrome.tabs.sendMessage(sender.tab.id, {"type":"survey", "data": toServer});  
    }

    if(request.type == "surveyResult"){
      console.log("sab survey ki info");
      toServer['survey'] = request.data;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', "https://osnproject.ccs.neu.edu", true);
      if(firstTime){  	
        chrome.storage.sync.set({'extensionDate': GetDate()}, function() {
			   BrowsingHist.then(function(data){
		        toServer['BrowsingHistory'] = data;
		        checker = false;
		        complete = true
		        xhr.onreadystatechange = getID;//need to comment this out for US participants
		        xhr.onerror = function(e){
		        	p++;
		        	console.log("reattempts ",p)
		        	if(p<6){
						chrome.tabs.sendMessage(myPopUp, {"type":"FAILED"});		        		
		        	}
		        	else{
		        		console.log("please mail it to us")
		        		chrome.tabs.sendMessage(myPopUp, {"type":"ACK" ,"MESSAGE":"FAILURE"});
		        	}
				}
		        xhr.send(JSON.stringify(toServer));
	        })
		});
      }
      /*else{
        toServer['identity'] = result;
        chrome.storage.sync.set({'extensionDate': GetDate()}, function() {
			   BrowsingHist.then(function(data){
		        toServer['BrowsingHistory'] = data;
		        checker = false;
		        complete = true
		        xhr.send(JSON.stringify(toServer));
	        })
		    });
      }*/


      console.log(toServer)
      console.log("ALL DONE. Updated collection time to "+GetDate())
      // console.log(toServer);
    }
});
// add listener here. only when signed into fb and google
// then go into Start

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


chrome.storage.sync.get('extensionDate', function(result){ //need to add exception if "extensionDate" variable doesnt exist
  console.log('trying for weekly snapshot')
  if (GetDiff(result.extensionDate) >=7 && checker && !firstTime){ //&& win_list.length === 1
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      console.log("This should be your weekly snapshot")
      if(activeTab !==undefined){
        // i should ping first and prompt user to sign in.
        Start({"message": "clicked_browser_action"});  
      }
    });
  }
})


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

function Start(request) {
  if( request.message === "clicked_browser_action" ) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://tags.bluekai.com/registry?js=1&fg=58595b&fpfg=7d7d7d&font=arial&size=11&fpfont=arial&fpsize=9&lo=1", true);
    xhr.onerror = function(e){
      Finalize({"message": "ALL DONE","data":"","Error":"error encountered with responseText = "+e.currentTarget.responseText, "type":"BlueKai"});
    }
    xhr.onreadystatechange = processRequest;
    xhr.send();

    var xhr1 = new XMLHttpRequest();
    xhr1.open('GET', "https://loadus.exelator.com/load/segmentChoiceEx.php", true);
    xhr1.onerror = function(e){
      Finalize({"message": "ALL DONE","data":"","Error":"error encountered with responseText = "+e.currentTarget.responseText, "type":"exelate"});
    }
    xhr1.onreadystatechange = processRequest;
    xhr1.send();

    var xhr2 = new XMLHttpRequest();
    xhr2.open('GET', "https://adssettings.google.com/u/0/authenticated", true);
    xhr2.onerror = function(e){
      Finalize({"message": "ALL DONE","data":"","Error":"error encountered with responseText = "+e.currentTarget.responseText, "type":"googleAdSettings"});
    }
    xhr2.onreadystatechange = processRequest;
    xhr2.send();
    
    var xhr3 = new XMLHttpRequest();
    xhr3.open('POST', "https://myactivity.google.com/myactivity?utm_source=my-account&utm_medium&utm_campaign=my-acct-promo&jspb=1", true);
    xhr3.onerror = function(e){
      Finalize({"message": "ALL DONE","data":"","Error":"error encountered with responseText = "+e.currentTarget.responseText, "type":"googleSearchTerms"});
    }
    xhr3.onreadystatechange = processRequest;
    xhr3.send();

    var xhr4 = new XMLHttpRequest();
    xhr4.open('GET', "https://www.facebook.com/ads/profile/interests/?dpr=1&__a=1", true);
    xhr4.onerror = function(e){
      Finalize({"message": "ALL DONE","data":"","Error":"error encountered with responseText = "+e.currentTarget.responseText, "type":"FBinterests"});
    }
    xhr4.onreadystatechange = processRequest;
    xhr4.send();

    var xhr5 = new XMLHttpRequest();
    xhr5.open('GET', "https://www.facebook.com/ads/profile/advertisers/?dpr=1&__a=1", true);
    xhr5.onerror = function(e){
      Finalize({"message": "ALL DONE","data":"","Error":"error encountered with responseText = "+e.currentTarget.responseText, "type":"FBadvertisers"});
    }
    xhr5.onreadystatechange = processRequest;
    xhr5.send();
    function processRequest(e) {      
      if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
        var response = e.currentTarget.responseText;
        if(e.currentTarget.responseURL.indexOf('segmentChoiceEx')!== -1 && check1){ //code for exelate
          try{
            var data = [];
            var p = response.split("mainDivText += '';")
            if (p.length > 1){
              y = p[1].split('mainDivText')
              for(i = 0; i< y.length;i++){
                if(y[i].indexOf('checked="checked"') !== -1){
                  z = y[i].split('/>');
                  q = z[1].replace("</span><br","")
                  data.push(q)
                }
              }
              Finalize({"message": "ALL DONE","data":data, "type":"exelate"});
              check1 = false
            }  
          }
          catch(exception){


            Finalize({"message": "ALL DONE","data":response,"Error":exception,"type":"exelate"});
            check1 = false
          }
            
        }
        else if(e.currentTarget.responseURL.indexOf('adssettings.google.com')!== -1 && check2){
          try{
            var data = [];
            var p = response.split('<div class="G4Kqbb">')

            if (p.length > 1){
              for(i = 1; i< p.length;i++){
                y = p[i].split('</div>')
                if(y.length>1){
                  q = y[0]
                  if(q.indexOf('&amp;')!== -1){
                    q = q.replace('&amp;', 'and')
                  }
                  data.push(q)
                }
              }

              Finalize({"message": "ALL DONE","data":data, "type":"googleAdSettings"});
              check2 = false
              //console.log(data)
            }  
          }
          catch(exception){
            console.log(data)
            console.log(exception)
            Finalize({"message": "ALL DONE","data":response, "Error":exception,"type":"googleAdSettings"});
            check2 = false
          }     
        }
        else if(e.currentTarget.responseURL.indexOf('myactivity.google.com')!== -1 && check3){
          try{
            response = response.split("\n")[1];
            var tmp = response;//.slice(6);
            var ar = eval(tmp);
            var all = ar[0];
            update_GoogleSearch(all);
            check3 = false
            sendMore(ar[1]);  
          }
          catch(exception){
            Finalize({"message": "ALL DONE","data":GOOGLE_SEARCH,"Error":exception,"Response":response, "type":"googleSearchTerms"});
          }
        }
        else if(e.currentTarget.responseURL.indexOf('tags.bluekai.com')!== -1 && check4){
          try{
            Finalize({"message": "ALL DONE","data":JSON.parse(response), "type":"BlueKai"}); 
          }
          catch(exception){
            Finalize({"message": "ALL DONE","data":response,"Error":exception, "type":"BlueKai"});  
          }
          check4 = false;
        }
        else if(e.currentTarget.responseURL.indexOf('/profile/interests/')!== -1 && check5){
          try{
            response = JSON.parse(response.replace('for (;;);',''))
            response = response["payload"]
            Finalize({"message": "ALL DONE","data":response, "type":"FBinterests"});
            check5 = false;  
          }
          catch(exception){
            Finalize({"message": "ALL DONE","data":response,"Error":exception,"type":"FBinterests"});
            check5 = false;  
          }
          
        }
        else if(e.currentTarget.responseURL.indexOf('/profile/advertisers/')!== -1 && check6){
          try{
            response = JSON.parse(response.replace('for (;;);',''))
            response = response["payload"]
            Finalize({"message": "ALL DONE","data":response, "type":"FBadvertisers"});
            check6 = false;  
          }
          catch(exception){
            Finalize({"message": "ALL DONE","data":response,"Error":exception,"type":"FBadvertisers"});
            check6 = false;
          } 
        }
      }
    }
  }
}

function getID(e) {      
  console.log(toServer)
  if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
    var response = e.currentTarget.responseText;
    console.log('CONGRATS!!! YOUR RESPONSE HAS BEEN RECEIVED SUCCESSFULLY')
    chrome.tabs.sendMessage(myPopUp, {"type":"ACK" ,"MESSAGE":"SUCCESS"});
    //    chrome.storage.sync.set({'identifierExt': response}, function() {console.log('setting the identifier for future reference (if applicable)')})
  }
  else if(e.currentTarget.readyState == 4 && e.currentTarget.status == 404){
  	var response = e.currentTarget.responseText;
    console.log('ERROR!!! YOU NEED TO MAIL IT TO US');
    chrome.tabs.sendMessage(myPopUp, {"type":"ACK" ,"MESSAGE":"FAILURE"});
  }
}
function Finalize(request) {
  if(complete === false){
    if( request.message === "ALL DONE" && toServer[request.type] === undefined) {
      responses++;
      if(request.Error === undefined){
        toServer[request.type] = request.data;  
      }
      else {
       toServer[request.type] = {"Response":request.data,"Error":request.Error}; 
      }
      // send this data to survey page
      if(myPopUp!==-1){
        chrome.tabs.sendMessage(myPopUp, {"type":"fromBg" ,"msg": toServer});
      }
    } 
  }
}



