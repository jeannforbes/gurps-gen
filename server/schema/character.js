let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let characterSchema = new Schema({
    meta: {
        created: Date,
        updated: Date
    },
    name: String,
    player: String,
    pointsTotal: Number,
    pointsUnspent: Number,
    description: {
        height      : String,
        weight      : String,
        sizeModifier: Number,
        age         : Number,
        appearance  : String
    },
    stats: {
        ST  : Number,
        DX  : Number,
        IQ  : Number,
        HT  : Number,
        HP  : Number,
        Will: Number,
        Per : Number,
        FP  : Number
    },
    advantages   : [String],
    disadvantages: [String],
    skills       : [String],
    inventory: {
        meleeWeapons : [String],
        rangedWeapons: [String],
        armor        : [String],
        possessions  : [String]
    }
});

characterSchema.methods.findByPlayer = (cb) => {
    return this.model('Character').find({ player: this.player }, cb);
};

characterSchema.methods.findByPointsTotal = (cb) => {
    return this.model('Character').find({ pointsTotal: this.pointsTotal }, cb);
}

characterSchema.methods.findByIdAndUpdate = (cb) => {
    // Does this character
}

let Character = mongoose.model('Character', characterSchema);

module.exports = Character;