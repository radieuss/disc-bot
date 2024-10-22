const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');


const db = mongoose.connection.useDb('disc_bot');

const autoRoleSchema = new Schema({ 
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    roleId: {
        type: String,
        required: true,
    },
});

module.exports = db.model('AutoRole', autoRoleSchema);