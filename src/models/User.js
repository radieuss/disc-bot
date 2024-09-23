const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');


const db = mongoose.connection.useDb('disc_bot');

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    lastDaily: {
        type: Date,
        required: true,
    },
})

module.exports = db.model('User', userSchema);