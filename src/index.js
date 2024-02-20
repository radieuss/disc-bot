require('dotenv').config()
const {Client, IntentsBitField}=require('discord.js')

const client=new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ]
})

//c.user.tag gives username#____
//c.user.username gives username
//c.user.id gives id
client.on('ready', ()=>{//c stands for client, but cant redefine it
    console.log('DARWIZZYS🐐 ALIVE')
    // client.guilds.cache.forEach(guild => {
    //     const generalChannel = guild.channels.cache.find(channel => channel.name == 'general' && channel.type == 0);
    //     if (generalChannel) {
    //         generalChannel.send('DARWIZZYS🐐 ALIVE')
    //     } else {
    //         console.error(`'general' channel not found in ${guild.name}.`);
    //     }
    // });
})
client.on('messageCreate', (message)=>{  
    if(message.author.bot||message.system){//if bot send msg, do nth
        return;
    }
    if(message.author.username=='antheyuhh'){//if bot send msg, do nth
        message.reply(`Fuck Off ${message.author}`)
        return;
    }
    if(message.content=='hello'){  
        message.reply('Fuck Off')
    }else{
        message.reply('DARWIZZYS THE GOAT🐐🐐')
    }
    
})

client.on("guildMemberAdd", (member) => {
    member.guild.channels.cache.find(c => c.name === "general").send(`WELCOME OUR NEWEST MEMBER ${member.user} TO THE CCP`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const guild = newState.guild
    const generalChannel = guild.channels.cache.find(channel => channel.name == 'ping-call' && channel.type == 0);
    if (!generalChannel) {
        console.error(`General text channel not found in ${guild.name}.`);
        return;
    }
    if (oldState.channel !== newState.channel) {
        // User joined or left a voice channel
        if (oldState.channel) {
            generalChannel.send(`WHY YOU LEAVE ${oldState.member}`);
        }
    }
});


client.login(process.env.Token)