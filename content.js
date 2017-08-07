// content.js
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

      xhr.onreadystatechange = processRequest;
      xhr1.onreadystatechange = processRequest;
      xhr2.onreadystatechange = processRequest;
      xhr3.onreadystatechange = processRequest;
      
      function processRequest(e) {      
        if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
            var response = e.currentTarget.responseText;
            if(e.currentTarget.responseURL.indexOf('segmentChoiceEx')!== -1){ //code for exelate
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
              }  
            }
            else if(e.currentTarget.responseURL.indexOf('adssettings.google.com')!== -1){
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
              }
            }
            else if(e.currentTarget.responseURL.indexOf('myactivity.google.com')!== -1){
              response = response.replace(")]}',","")
              console.log(response);
              chrome.runtime.sendMessage({"message": "ALL DONE","data":response, "type":"googleSearchTerms"});
            }
            else{
              //console.log(response)
              chrome.runtime.sendMessage({"message": "ALL DONE","data":JSON.parse(response), "type":"BlueKai"});
            }
        }
      }
    }
  }
);