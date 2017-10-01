

https = require('https');
const fs = require('fs');

var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/osnproject.ccs.neu.edu/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/osnproject.ccs.neu.edu/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/osnproject.ccs.neu.edu/chain.pem')
};
function ID() {
  return '_' + Math.random().toString(36).substr(2, 9);
};
server = https.createServer(options,function(req, res) {
    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
	    var id = ID();
        req.on('end', function () {
        	toServer = JSON.parse(body);
            if(toServer['identity'] === undefined){
                fs.writeFile('/home/ufarooq/BrowserExtension/User_Data/'+id+'ID_TS'+Date.now()+'.txt', body, (err) => {
                    if (err) throw err;
                    console.log('Lyric saved!');
                });
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(id);
            }
            else{
                fs.writeFile('/home/ufarooq/BrowserExtension/User_Data/'+toServer['identity']+'_'+Date.now()+'.txt', body, (err) => {
                    if (err) throw err;
                    console.log('Lyric saved!');
                });
            }
        });
    }
    else{
	    res.end("not now")
    }
});

port = 443;
host = '129.10.115.133';
server.listen(port, host);
console.log('Listening at https://' + host + ':' + port);
