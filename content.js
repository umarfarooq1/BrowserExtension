// content.js
GOOGLE_SEARCH = []
check1 = true
check2 = true
check3 = true
check4 = true
check5 = true
check6 = true
NumberofDaysToGoBackForGoogleSearch = 6
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

function update_GoogleSearch(all){
  var arr = [];
  for (var i=0; i <all.length ; i++) {
    var sub = all[i][1];
    for (var x=0; x<sub.length ; x++) {
      var sub1 = sub[x][1][2];
      if(sub1 === null){
        continue;
      }
      for (var j=0; j<sub1.length ; j++) {
        for (var k=0; k<sub1[j].length ; k++) {
          if(sub1[j][k] !== null && sub1[j][k].length === 4){
            GOOGLE_SEARCH.push(sub1[j][k])
          }
        }
      }
    }
  }
  //console.log(arr)
  //GOOGLE_SEARCH.push(arr);
  //console.log("bye")
}
function sendMore(ct){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "//myactivity.google.com/myactivity?utm_source=my-account&utm_medium&utm_campaign=my-acct-promo&jspb=1", true);
  xhr.send(JSON.stringify({"ct":ct}));
  xhr.onreadystatechange = processGoogleSearchRequest;
}
function processGoogleSearchRequest(e) {      
  if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
    var response = e.currentTarget.responseText;
    if(e.currentTarget.responseURL.indexOf('myactivity.google.com')!== -1){
       response = response.split("\n")[1]
       var tmp = response//.slice(6);
       var ar = eval(tmp);
       var all = ar[0];
       update_GoogleSearch(all)
       if(GetDiff(Math.floor(ar[0][0][0]/1000)) > NumberofDaysToGoBackForGoogleSearch){
          chrome.runtime.sendMessage({"message": "ALL DONE","data":GOOGLE_SEARCH, "type":"googleSearchTerms"});
       }
       else{
        sendMore(ar[1]);
       }
    }       
  }
}
chrome.runtime.sendMessage({ text: "what is my tab_id?" });
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
    	//console.log(request);
      var xhr = new XMLHttpRequest();
      xhr.open('GET', "//tags.bluekai.com/registry?js=1&fg=58595b&fpfg=7d7d7d&font=arial&size=11&fpfont=arial&fpsize=9&lo=1", true);
      xhr.send();

      var xhr1 = new XMLHttpRequest();
      xhr1.open('GET', "//loadus.exelator.com/load/segmentChoiceEx.php", true);
      xhr1.send();

      var xhr2 = new XMLHttpRequest();
      xhr2.open('GET', "//adssettings.google.com/u/0/authenticated", true);
      xhr2.send();
      
      var xhr3 = new XMLHttpRequest();
      xhr3.open('POST', "//myactivity.google.com/myactivity?utm_source=my-account&utm_medium&utm_campaign=my-acct-promo&jspb=1", true);
      xhr3.send();

      var xhr4 = new XMLHttpRequest();
      xhr4.open('GET', "//www.facebook.com/ads/profile/interests/?dpr=1&__a=1", true);
      xhr4.send();

      var xhr5 = new XMLHttpRequest();
      xhr5.open('GET', "//www.facebook.com/ads/profile/advertisers/?dpr=1&__a=1", true);
      xhr5.send();
      xhr.onreadystatechange = processRequest;
      xhr1.onreadystatechange = processRequest;
      xhr2.onreadystatechange = processRequest;
      xhr3.onreadystatechange = processRequest;
      xhr4.onreadystatechange = processRequest;
      xhr5.onreadystatechange = processRequest;
      function processRequest(e) {      
        if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
            var response = e.currentTarget.responseText;
            if(e.currentTarget.responseURL.indexOf('segmentChoiceEx')!== -1 && check1){ //code for exelate
              //console.log("i should be here once")
              var data = [];
              //console.log(e.currentTarget.responseURL)
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
                //console.log(data)
                chrome.runtime.sendMessage({"message": "ALL DONE","data":data, "type":"exelate"});
                check1 = false
              }  
            }
            else if(e.currentTarget.responseURL.indexOf('adssettings.google.com')!== -1 && check2){
              //console.log("i should be here once")
              var data = [];
              //console.log(e.currentTarget.responseURL)
              //console.log(response)
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
                //console.log(data)
                chrome.runtime.sendMessage({"message": "ALL DONE","data":data, "type":"googleAdSettings"});
                check2 = false
              }
            }
            else if(e.currentTarget.responseURL.indexOf('myactivity.google.com')!== -1 && check3){
              response = response.split("\n")[1]
              var tmp = response//.slice(6);
              var ar = eval(tmp);
              var all = ar[0];
              update_GoogleSearch(all)

              //console.log("i should be here exactly once")
              check3 = false
              sendMore(ar[1]);
            }
            else if(e.currentTarget.responseURL.indexOf('tags.bluekai.com')!== -1 && check4){
              //console.log(response)
              //console.log("i should be here once")
              chrome.runtime.sendMessage({"message": "ALL DONE","data":JSON.parse(response), "type":"BlueKai"});
              check4 = false;
            }
            else if(e.currentTarget.responseURL.indexOf('/profile/interests/')!== -1 && check5){
              response = JSON.parse(response.replace('for (;;);',''))
              response = response["payload"]
              chrome.runtime.sendMessage({"message": "ALL DONE","data":response, "type":"FBinterests"});
              //console.log(response)
              check5 = false;
            }
            else if(e.currentTarget.responseURL.indexOf('/profile/advertisers/')!== -1 && check6){
              response = JSON.parse(response.replace('for (;;);',''))
              response = response["payload"]
              chrome.runtime.sendMessage({"message": "ALL DONE","data":response, "type":"FBadvertisers"});
              //console.log(response)
              check6 = false;
            }
        }
      }
    }
  }
);
