const {Client, Interaction, PermissionFlagsBits} = require("discord.js");
const AutoRole = require('../../models/AutoRole');

module.exports = {
    callback: async (client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply('This command can only be used in a server');
            return
        }

        try {
            await interaction.deferReply();

            if (!await AutoRole.exists({guildId: interaction.guild.id})) {
                interaction.editReply('Auto role has not set');
                return;
            }

            await AutoRole.findOneAndDelete({guildId: interaction.guild.id});
            interaction.editReply('Auto role has been disabled');
        } catch (error) {
            console.log(error);
        }
    },

    name: 'autorole-disable',
    description: 'Disable the auto role for the server',
    permissionsRequired: [PermissionFlagsBits.Administrator],

}