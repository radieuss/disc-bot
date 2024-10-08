const {Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js')

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client,interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided';
        await interaction.deferReply();

        const targetUser = await interaction.guild.members.cache.get(targetUserId);

        if(!targetUser) { 
            await interaction.editReply('User not found in server');
            return;
        };


        if(targetUser.id ===interaction.guild.ownerId) {
            await interaction.editReply('You cannot ban the server owner');
            return;
        };

        const targetUserRolePosition = targetUser.roles.highest.position; //highest role of the target user
        const interactionMemberRolePosition = interaction.member.roles.highest.position; //highest role of the interaction member running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; //highest role of the bot

        if(interactionMemberRolePosition <= targetUserRolePosition) {
            await interaction.editReply(`You cannot ban <@${targetUser.id}> because they have same or higher role than you`);
            return;
        };

        if(botRolePosition <= targetUserRolePosition) {
            await interaction.editReply(`I cannot ban <@${targetUser.id}> because they have same or higher role than me`);
            return;
        };

        //ban target user
        try {
            await targetUser.ban({reason});
            await interaction.editReply(`<@${targetUser.id}> has been banned. \nReason: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`There was an error while trying to ban <@${targetUser.id}>`);
        };

    },

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

    permissionsRequired:[ PermissionFlagsBits.BanMembers],
    botPermissions:[ PermissionFlagsBits.BanMembers],
}