console.log("data")

chrome.runtime.sendMessage({type:'sendToMe'});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if(request.type == "survey"){
  		var tmp = request.data;
  		document.querySelector('#survey').innerHTML = "result<br/>" + JSON.stringify(tmp);
  	}

});
