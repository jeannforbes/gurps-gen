// Node packages
let app = require('express')();
let server = require('http').Server(app);

// CONSTANTS
const PORT = process.env.PORT || 3000;

const getClientFile = (filetype) => {
	app.get('/*.'+filetype, (req, res) => {
	    let uid = req.params.uid;
	    let path = req.params[Object.keys(req.params)[0]] ? 
	        req.params[Object.keys(req.params)[0]] : '';
	    res.sendFile(path+'.'+filetype, {root: './client/'}); 
	});
}

const startServer = () => {
    server.listen(PORT);

    app.get('/', (req,res) => {
    	res.sendFile('index.html', {root: './client/'});
    })

    getClientFile('html');
    getClientFile('css');
    getClientFile('js');
};

startServer();