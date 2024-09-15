const {Client, Interaction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} = require("discord.js");
const { createCanvas, Image, loadImage } = require("canvas");
const sharp = require('sharp');
const axios = require('axios');


module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async callback(client, interaction) {
        // Create the canvas
        const canvas = createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
    
        // Fill the background with white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Load the user's avatar
        const avatarURL = interaction.user.displayAvatarURL({ format: 'webp' });
        
        // Fetch the image buffer
        const response = await axios.get(avatarURL, { responseType: 'arraybuffer' });
        const webpBuffer = Buffer.from(response.data);

        // Convert WebP to JPEG using sharp
        const jpgBuffer = await sharp(webpBuffer).toFormat('jpeg').toBuffer();

        // Now you can use jpgBuffer with loadImage
        const image = await loadImage(jpgBuffer);
        // Draw the avatar on the canvas (circular crop)
        const avatarSize = 128;
        const avatarX = 50;
        const avatarY = 50;
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true); // Circular crop
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
        
        // Add the user's username to the canvas
        ctx.font = '30px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${interaction.user.username}#${interaction.user.discriminator}`, 200, 100);
    
        // Create an attachment to send
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'canvas.png' });
    
        // Reply to the interaction with the canvas image
        await interaction.reply({ files: [attachment] });
    },
    
    name: 'canvas',
    description: 'Test canvas',
};
