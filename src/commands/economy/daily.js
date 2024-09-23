const {Client, Interaction} = require('discord.js');
const User = require('../../models/User');

const dailyAmount = 1000;

module.exports = {
    name: 'daily',
    description: 'Claim your daily',
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content:'This command can only be used in a server',
                ephemeral: true,
            });
            return;
        }
        try {
            await interaction.deferReply();

            const query = { 
                userId: interaction.member.id ,
                guildId: interaction.guild.id
            };

            let user = await User.findOne(query);

            if (user) {
                const lastDailyDate = user.lastDaily.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyDate === currentDate) {
                    interaction.editReply('You have already claimed your daily today');
                    return;
                }
            }else {
                user = new User({
                    ...query,
                    lastDaily: new Date(),
                });
            }
            user.balance += dailyAmount;
            await user.save();

            interaction.editReply(`You have claimed your daily of ${dailyAmount} coins! New balance: ${user.balance}`);
        } catch (error) {
            console.log(`Error with daily: ${error}`);
        }
    }
}