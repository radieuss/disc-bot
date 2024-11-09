require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  Embed,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActivityType,
} = require("discord.js");

const mongoose = require("mongoose");

const eventHandler = require("./handlers/eventHandler");
const e = require("express");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB");

    eventHandler(client)

    client.login(process.env.TOKEN)
  } catch (error) {
    console.log(error);
  }
})();

// const roles = [//can use the managed property instead
//   {
//     id: "1214119996691578901",
//     label: "NY",
//   },
//   {
//     id: "1214120139243393055",
//     label: "SN",
//   },
//   {
//     id: "1214120295091146803",
//     label: "JH",
//   },
//   {
//     id: "1214120209133080627",
//     label: "CY",
//   },
// ];

// let twice=[
//   {
//     url:'https://www.youtube.com/watch?v=jCzez_q8si0',
//     name:'One Spark'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=haf67eKF0uo',
//     name:'I GOT YOU'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=f5_wn8mexmM',
//     name:'The Feels'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=i0p1bmr0EmE',
//     name:'What Is Love'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=CM4CkVFmTds&pp=ygUFdHdpY2U%3D',
//     name:'I Can\'t Stop Me'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=w4cTYnOPdNk&pp=ygUFdHdpY2U%3D',
//     name:'Set Me Free'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=kOHB85vDuow&pp=ygUFdHdpY2U%3D',
//     name:'Fancy'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=k6jqx9kZgPM&pp=ygUFdHdpY2U%3D',
//     name:'Talk that Talk'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=cKlEE_EYuNM&pp=ygUFdHdpY2U%3D',
//     name:'Moonlight Sunrise'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=rRzxEiBLQCA&pp=ygUSaGVhcnQgc2hha2VyIHR3aWNl',
//     name:'Heart Shaker'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=8A2t_tAjMz8&pp=ygULa25vY2sga25vY2s%3D',
//     name:'Knock Knock'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=0rtV5esQT6I&pp=ygUMbGlrZSBvb2ggYWho',
//     name:'Like Ooh-Ahh'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=Fm5iP0S1z9w&pp=ygUEZHRuYQ%3D%3D',
//     name:'Dance The Night Away'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=c7rCyll5AeY&pp=ygUIY2hlZXIgdXA%3D',
//     name:'Cheer Up'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=ePpPVE-GGJw&pp=ygUIdHQgdHdpY2U%3D',
//     name:'TT'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=mAKsZ26SabQ&pp=ygUKeWVzIG9yIHllcw%3D%3D',
//     name:'YES or YES'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=mH0_XpSHkZo&pp=ygUTbW9yZSBhbmQgbW9yZSB0d2ljZQ%3D%3D',
//     name:'MORE & MORE'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=vPwaXytZcgI&pp=ygUPc2NpZW50aXN0IHR3aWNl',
//     name:'Scientist'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=V2hlQkVJZhE&pp=ygUFbGlrZXk%3D',
//     name:'Likey'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=VQtonf1fv_s&pp=ygUMc2lnbmFsIHR3aWNl',
//     name:'Signal'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=3ymwOvzhwHs&pp=ygUSZmVlbCBzcGVjaWFsIHR3aWNl',
//     name:'Feel Special'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=XA2YEHn-A8Q&pp=ygUMYWxjb2hvbCBmcmVl',
//     name:'Alcohol-Free'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=f6YDKF0LVWw&pp=ygUKcG9wIG5heWVvbg%3D%3D',
//     name:'POP'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=jyw_vrI4ySg&pp=ygUOa2lsbGluIG1lIGdvb2Q%3D',
//     name:'Killin\' Me Good'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=CfUGjK6gGgs&pp=ygUGdGJ0aWVk',
//     name:'The Best Thing I Ever Did'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=zi_6oaQyckM&pp=ygUVdHdpY2UgbWVycnkgYW5kIGhhcHB5',
//     name:'Merry and Happy'
//   },
//   {
//     url:'https://www.youtube.com/watch?v=woKq2sD8xho&pp=ygUMZG8gbm90IHRvdWNo',
//     name:'Do not touch'
//   },
// ]

let status=[
  {
    name:'sucking wei qings dick',
    type:ActivityType.Custom
  },
  {
    name:'sucking gaybriels dick',
    type:ActivityType.Custom
  },
]


// c.user.tag gives username#____
// c.user.username gives username
// c.user.id gives id
client.on("ready", async () => {
  //c stands for client, but cant redefine it
  console.log("DARWIZZYS🐐 ALIVE");
  // client.guilds.cache.forEach(guild => {
  //     const generalChannel = guild.channels.cache.find(channel => channel.name == 'general' && channel.type == 0);
  //     if (generalChannel) {
  //         generalChannel.send('DARWIZZYS🐐 ALIVE')
  //     } else {
  //         console.error(`'general' channel not found in ${guild.name}.`);
  //     }
  // });

  /*setInterval(()=>{
    let random=Math.floor(Math.random() * 10)
    if(random>=2){
      let randomTwice=Math.floor(Math.random() * twice.length)
      client.user.setActivity({  
        name:twice[randomTwice].name,
        type:ActivityType.Streaming,
        url:twice[randomTwice].url
      })
    }else{
      client.user.setActivity(status[random])
    }*/

      // client.guilds.cache.forEach(guild => {
      //       const spamTim = guild.channels.cache.find(channel => channel.name == 'fukyou');
      //       const member = guild.members.cache.find(member => member.user.username === 't11mmmm');
      //       if (spamTim) {//setInterval send msg every 0.1second to @t11mmmm
      //           setInterval(()=>{
      //             spamTim.send(`<@${member.user.id}>`)
      //           }, 100)
      //       } else {
      //           console.error(`'general' channel not found in ${guild.name}.`);
      //       }
      //   });

    //   client.guilds.cache.forEach(guild => {
    //     //only if guild name is not 'DARWIZZYS🐐' then dont do it
    //     if(guild.name != 'YOUR MUM'){
    //       return;
    //     }
    //     const generalSpam = guild.channels.cache.find(channel => channel.name == 'general');
    //     if (generalSpam) {//setInterval send msg every 0.1second to @t11mmmm
    //         setInterval(()=>{
    //           generalSpam.send(`.`)
    //         }, 1)
    //     } else {
    //         console.error(`'general' channel not found in ${guild.name}.`);
    //     }
    // });

  }, 60000)

  //For roles message
  // try {
  //   const channel = await client.channels.cache.get("1214123252646019072");
  //   if (!channel) return;


  //   const row = new ActionRowBuilder();

  //   roles.forEach((role) => {
  //     row.components.push(
  //       new ButtonBuilder()
  //         .setCustomId(role.id)
  //         .setLabel(role.label)
  //         .setStyle(ButtonStyle.Primary)
  //     );
  //   });

  //   await channel.send({
  //     content: "Claim role",
  //     components: [row],
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

// client.on("messageCreate", (message) => {
//   if (message.author.bot || message.system) {
//     //if bot send msg, do nth
//     return;
//   }
//   if (message.author.username == "antheyuhh") {
//     //if bot send msg, do nth
//     message.reply(`Fuck Off ${message.author}`);
//     return;
//   }
//   if (message.content == "hello") {
//     message.reply("Fuck Off");
//   } else {
//     message.reply("DARWIZZYS THE GOAT🐐🐐");
//   }
// });

// client.on("guildMemberAdd", (member) => {
//   member.guild.channels.cache
//     .find((c) => c.name === "general")
//     .send(`WELCOME OUR NEWEST MEMBER ${member.user} TO THE CCP`);
// });

// client.on("voiceStateUpdate", (oldState, newState) => {
//   const guild = newState.guild;
//   const generalChannel = guild.channels.cache.find(
//     (channel) => channel.name == "ping-call" && channel.type == 0
//   );
//   if (!generalChannel) {
//     console.error(`General text channel not found in ${guild.name}.`);
//     return;
//   }
//   if (oldState.channel !== newState.channel) {
//     // User joined or left a voice channel
//     if (oldState.channel) {
//       generalChannel.send(`WHY YOU LEAVE ${oldState.member}`);
//     }
//   }
// });

// client.on("interactionCreate", async (interaction) => {
//   if (interaction.isButton()) {
//     try {
//       await interaction.deferReply({ ephemeral: true });

//     const role = interaction.guild.roles.cache.get(interaction.customId);
//     if (!role) {
//       interaction.editReply({
//         content: "I couldn't find that role",
//       });
//       return;
//     }

//     const hasRole = interaction.member.roles.cache.has(role.id)

//     if(hasRole){
//       await interaction.member.roles.remove(role);
//       await interaction.editReply(`The role ${role} has been removed`)
//     }else{
//       await interaction.member.roles.add(role);
//       await interaction.editReply(`The role ${role} has been added`)
//     }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   if (interaction.commandName === "hi") {
//     interaction.reply("hey!");
//   }
//   if (interaction.commandName === "anthea") {
//     interaction.reply("anthea is stupid");
//   }
//   if (interaction.commandName === "lol") {
//     interaction.reply("you are not funny");
//   }
//   if (interaction.commandName === "add") {
//     const num1 = interaction.options.get("first-number")?.value;
//     const num2 = interaction.options.get("second-number")?.value;
//     interaction.reply(`the sum is ${num1 + num2}`);
//   }
//   if (interaction.commandName === "embed") {
//     const embed = new EmbedBuilder()
//       .setTitle("Embed Title")
//       .setDescription("Embed desc")
//       .setColor("Random")
//       .addFields(
//         { name: "Field title", value: "lol", inline: true },
//         { name: "Field title 2", value: "lol", inline: true }
//       );

//     interaction.reply({ embeds: [embed] });
//   }
// });
