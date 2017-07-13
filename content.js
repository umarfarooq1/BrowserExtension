// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
    	console.log(request);
      var xhr = new XMLHttpRequest();
      xhr.open('GET', "//tags.bluekai.com/registry?js=1&fg=58595b&fpfg=7d7d7d&font=arial&size=11&fpfont=arial&fpsize=9&lo=1", true);
      xhr.send();
       
      xhr.onreadystatechange = processRequest;
      function processRequest(e) {
          if (xhr.readyState == 4 && xhr.status == 200) {
              var response = xhr.responseText;
              console.log(response)
              //alert(response.ip);
          }
      }
     // var firstHref = $("a[href^='http']").eq(0).attr("href");
     //console.log('hello from the content side')
      //console.log(firstHref);
      /*x = document.getElementsByClassName('item')
      for(i = 0; i<x.length;i++){
      	p = x[i].getElementsByTagName('img')
      	console.log(p[0].src)
      	console.log(p[1].src)
      	console.log(i)
      }*/
      //console.log('somebody editted the tab')
    }
  }
);