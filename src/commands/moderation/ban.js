const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js')

module.exports = {
    name:'ban',
    description:'rawr i ban you',
    deleted:false,
    // devOnly:Boolean,
    // testOnly:Boolean,
    options: [
        {
            name:'target-user',
            description:'user to ban',
            required:true,
            type:ApplicationCommandOptionType.Mentionable
        },
        {
            name:'reason',
            description:'why ban user😢',
            type:ApplicationCommandOptionType.String
        }
    ],

    permissionsRequired:[ PermissionFlagsBits.Administrator],
    botPermissions:[ PermissionFlagsBits.Administrator],

    callback: (client,interaction) => {
        interaction.reply(`ban...`)
    }
}