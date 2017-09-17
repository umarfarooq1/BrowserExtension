
http = require('http');
const fs = require('fs');
server = http.createServer( function(req, res) {
    console.dir(req.param);
    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
        	toServer = JSON.parse(body);
        	console.log(toServer.BlueKai!==undefined,"BLUEKAI")
        	console.log(toServer.BlueKai!==undefined,"FBadvertisers")
        	console.log(toServer.BlueKai!==undefined,"FBinterests")
        	console.log(toServer.BlueKai!==undefined,"googleAdSettings")
        	console.log(toServer.BlueKai!==undefined,"exelate")
        	console.log(toServer.BlueKai!==undefined,"googleSearchTerms")
        	fs.writeFile('2pac.txt', body, (err) => {  
			    // throws an error, you could also catch it here
			    if (err) throw err;

			    // success case, the file was saved
			    console.log('Lyric saved!');
			});
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    }
    else{
	    res.end("not now")
    }
});

port = 3000;
host = '129.10.115.133';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
