const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');

const db = mongoose.connection.useDb('disc_bot');

const levelSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },

});

module.exports = db.model('Level', levelSchema);