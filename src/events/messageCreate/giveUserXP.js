const {Client, Message, Guild} = require("discord.js");
const Level = require("../../models/Level.js");
const calculateLevelXP = require("../../utils/calculateLevelXP.js");
const cooldowns = new Set();


function getRandomXP(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
    if(!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

    const xpToGive = getRandomXP(5,15);

    const query = {
        userId : message.author.id,
        guildId: message.guild.id,
    };

    try {
        const level = await Level.findOne(query);

        if(level){
            level.xp  += xpToGive;

            if (level.xp > calculateLevelXP(level.level)){
                level.xp = 0
                level.level += 1;

                message.channel.send(`Congrats, ${message.member}, you are now level ${level.level}`);
                
            }

            await level.save().catch((err) => {
                console.log(`Error saving updated level ${err}`);
                return;
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
        }

        if(!level){
            const newLevel = new Level({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive,
            });

            await newLevel.save().catch((err) => {
                console.log(`Error saving new level: ${err}`);
                return;
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
        }
    } catch (error) {
        console.log(`Error giving xp: ${error}`);
    }
}