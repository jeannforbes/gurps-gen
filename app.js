// Node packages
let bodyParser = require('body-parser');

let app = require('express')();
let server = require('http').Server(app);
let mongoose = require('mongoose');
let Character = require('./server/schema/character.js');

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
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    mongoose.connect('mongodb://localhost/gurps-gen', {useMongoClient: true});
    mongoose.Promise = global.Promise;
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', () => {
        console.log('Connected to database.');
        // Handle character store/retrieval requests
        app.get('/characters', (req, res) => {
            Character.find( (err, characters) => {
                if(err) return console.log(err);
                console.log(characters);
                request(options, function(err,response,body){
                    let json = JSON.parse(body);
                    console.log(json);
                    res.json(resquest.json);
                });
                return res.send(request.json);
            });
        });
        app.get('/characters/*', (req, res) => {

        });
        app.post('/characters/*', (req, res) => {
            let character = new Character({
                meta: {
                    created: new Date()
                },
                name: req.body.name,
                player: req.body.player,
                pointsTotal: req.body.pointsTotal,
                pointsUnspent: req.body.pointsUnspent,
                description: {
                    height      : req.body.description.height,
                    weight      : req.body.description.weight,
                    sizeModifier: req.body.description.sizeModifier,
                    age         : req.body.description.age,
                    appearance  : req.body.description.appearance
                },
                stats: {
                    ST  : req.body.stats.ST || 10,
                    DX  : req.body.stats.DX || 10,
                    IQ  : req.body.stats.IQ || 10,
                    HT  : req.body.stats.HT || 10,
                    HP  : req.body.stats.HP || req.body.stats.ST || 10,
                    Will: req.body.stats.Will || req.body.stats.IQ || 10,
                    Per : req.body.stats.Per || req.body.stats.IQ || 10,
                    FP  : req.body.stats.FP || req.body.stats.HT || 10
                },
                advantages   : req.body.advantages,
                disadvantages: req.body.disadvantages,
                skills       : req.body.skills,
                inventory: {
                    meleeWeapons : req.body.meleeWeapons,
                    rangedWeapons: req.body.rangedWeapons,
                    armor        : req.body.armor,
                    possessions  : req.body.possessions
                }
            });
            character.saveCharacter();
            res.status = 200;
            res.send({msg: 'Added character to database'});
        });
    });

    server.listen(PORT);

    app.get('/', (req,res) => {
    	res.sendFile('index.html', {root: './client/'});
    });
    getClientFile('html');
    getClientFile('css');
    getClientFile('js');
};

startServer();