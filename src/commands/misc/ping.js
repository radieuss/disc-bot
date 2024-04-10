module.exports = {
    name:'ping',
    description:'rawr',
    // devOnly:Boolean,
    // testOnly:Boolean,
    // options:Object[],
    callback: (client,interaction) => {
        interaction.reply(`RAWR ${client.ws.ping}ms`)
    }
}