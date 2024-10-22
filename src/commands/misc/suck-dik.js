const {Client, Interaction, PermissionFlagsBits} = require("discord.js");

module.exports = {
    callback: async (client, interaction) => {
        interaction.reply(`sucking <@${interaction.user.id}> off`);
    },
    name:'suck-dik',
    description:'suck dick',
}