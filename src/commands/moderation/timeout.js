const { Client, Interaction, ApplicationCommandOptionType,PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client,interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const duration = interaction.options.get('duration').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided';
        
        await interaction.deferReply();

        const targetUser = await interaction.guild.members.cache.get(targetUserId);
        if(!targetUser) {
            await interaction.editReply('User not found in server');
            return;
        };

        if(targetUser.user.bot) {
            await interaction.editReply('You cannot time out a bot');
            return;
        };

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply('Invalid duration');
            return;
        };

        if (msDuration < 5000) {
            await interaction.editReply('Duration must be between 5 seconds and 28 days');
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; //highest role of the target user
        const interactionMemberRolePosition = interaction.member.roles.highest.position; //highest role of the interaction member running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; //highest role of the bot

        if(interactionMemberRolePosition <= targetUserRolePosition) {
            await interaction.editReply(`You cannot timeout <@${targetUser.id}> because they have same or higher role than you`);
            return;
        };

        if(botRolePosition <= targetUserRolePosition) {
            await interaction.editReply(`I cannot timeout <@${targetUser.id}> because they have same or higher role than me`);
            return;
        };

        //timeout target user
        try {
            const { default: prettyMs} = await import('pretty-ms');

            if(targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration,reason);
                await interaction.editReply(`<@${targetUser.id}> timeout has been updated to ${prettyMs(msDuration,{verbose:true})}. Reason: ${reason}`);
                return;
            }
            console.log(typeof msDuration)
            await targetUser.timeout(msDuration,reason);
            await interaction.editReply(`<@${targetUser.id}> has been timed out for ${prettyMs(msDuration,{verbose:true})}. \nReason: ${reason}`);

        } catch (error) {
            console.error(error);
            await interaction.editReply(`There was an error while trying to time out <@${targetUser.id}>`);
        };




    },


    name:'timeout',
    description:'rawr i time you out',
    options: [
        {
            name:'target-user',
            description:'user to time out',
            type:ApplicationCommandOptionType.Mentionable,
            required : true,
        },
        {
            name:'duration',
            description:'duration of the timeout',
            type:ApplicationCommandOptionType.String,
            required : true,
        },
        {
            name:'reason',
            description:'why time out user😢',
            type:ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired:[ PermissionFlagsBits.MuteMembers],
    botPermissions:[ PermissionFlagsBits.MuteMembers],
}