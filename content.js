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
       
      xhr.onreadystatechange = processRequest;
      xhr1.onreadystatechange = processRequest;
      
      function processRequest(e) {      
        if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
            var response = e.currentTarget.responseText;
            if(e.currentTarget.responseURL.indexOf('segmentChoiceEx')!== -1){ //code for exelate
              var data = [];
              console.log(e.currentTarget.responseURL)
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
                console.log(data)
              }  
            }
            else{
              console.log(response)
            }
            
            chrome.runtime.sendMessage({"message": "ALL DONE"});
        }
      }
    }
  }
);