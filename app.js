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
            Character.find( (err, result) => {
                if(err) return console.log(err);
                return res.send(result);
            });
        });
        // Return a specific character by id
        app.get('/characters/*', (req, res) => {
            let cid = req._parsedUrl.path.split('/')[2];
            console.log(cid);
            Character.find( { '_id':cid }, (err, result) => {
                if(err) {console.log(err); return;}
                res.status = 200;
                return res.send(result);
            })
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
                    ST  : parseInt(req.body.stats.ST) || 10,
                    DX  : parseInt(req.body.stats.DX) || 10,
                    IQ  : parseInt(req.body.stats.IQ) || 10,
                    HT  : parseInt(req.body.stats.HT) || 10,
                    HP  : parseInt(req.body.stats.HP) 
                       || parseInt(req.body.stats.ST) || 10,
                    Will: parseInt(req.body.stats.Will) 
                       || parseInt(req.body.stats.IQ) || 10,
                    Per : parseInt(req.body.stats.Per) 
                       || parseInt(req.body.stats.IQ) || 10,
                    FP  : parseInt(req.body.stats.FP) 
                       || parseInt(req.body.stats.HT) || 10
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
            character.save();
            res.status = 200;
            res.send({msg: 'Added character to database'});
        });
    });

    server.listen(PORT);

    app.get('/', (req,res) => { res.sendFile('index.html', {root: './client/'}); });
    getClientFile('html');
    getClientFile('css');
    getClientFile('js');
    getClientFile('ico');
};

startServer();