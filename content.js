// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
    	console.log(request);
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