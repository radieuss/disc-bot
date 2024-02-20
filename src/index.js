require('dotenv').config()
const {Client, IntentsBitField}=require('discord.js')

const client=new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

//c.user.tag gives username#____
//c.user.username gives username
//c.user.id gives id
client.on('ready', (c)=>{//c stands for client, but cant redefine it
    console.log(`DARWIZZYS🐐 ALIVE`)
})
client.on('messageCreate', (message)=>{  
    if(message.author.bot){//if bot send msg, do nth
        return;
    }

    if(message.content=='hello'){  
        message.reply('Fuck Off')
    }else{
        message.reply('DARWIZZYS THE GOAT')
    }
    
})
client.login(process.env.Token)