const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits } = require("discord.js");
const AutoRole = require('../../models/AutoRole');

module.exports = {
    callback: async (client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply('This command can only be used in a server');
            return
        }

        const targetRoleId = interaction.options.get('role').value;

        try {
            await interaction.deferReply();
            let autoRole = await AutoRole.findOne({guildId: interaction.guild.id});

            if (autoRole) {
                if(autoRole.roleId === targetRoleId){
                    interaction.editReply('Auto role is already set to this role. Run /autorole-disable to disable');
                    return;
                }

                autoRole.roleId = targetRoleId;
            } else {
                autoRole = new AutoRole({
                    guildId: interaction.guild.id,
                    roleId: targetRoleId,
                });
            }

            await autoRole.save();
            interaction.editReply('Auto role has been set. To disable, run /autorole-disable');
        } catch (error) {
            console.log(error);
        }
    },

    name: 'autorole-configure',
    description: 'Configure the auto role for the server',
    options: [
        {
            name: 'role',
            description: 'The role you want to give to new members',
            type: ApplicationCommandOptionType.Role,
            required: true,
        }
    ],
    permissionsRequired:[PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],

}