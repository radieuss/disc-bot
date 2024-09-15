const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const Level = require("../../models/Level.js");
const calculateLevelXP = require("../../utils/calculateLevelXP.js");
const { createCanvas, loadImage } = require("canvas");
const sharp = require('sharp');
const axios = require('axios');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('This command can only be used in a server');
            return;
        }

        await interaction.deferReply();

        const mentionUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id
        });

        if (!fetchedLevel) {
            interaction.editReply(
                mentionUserId ? `<@${targetUserObj.user.id}> does not have any levels yet` : `You do not have any levels yet`
            );
            return;
        }

        let allLevels = await Level.find({
            guildId: interaction.guild.id
        }).select('-_id userId level xp');

        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
        
        let currentLevel = fetchedLevel.level;
        let currentXp = fetchedLevel.xp;
        let requiredXp = calculateLevelXP(currentLevel);

        // Create the canvas
        const canvas = createCanvas(2080, 720);
        const ctx = canvas.getContext('2d');

        // Fill the background with cyan
        const backgroundColor = 'cyan';
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load the user's avatar
        const avatarURL = targetUserObj.user.displayAvatarURL({ format: 'webp' });

        // Fetch the image buffer
        const response = await axios.get(avatarURL, { responseType: 'arraybuffer' });
        const webpBuffer = Buffer.from(response.data);

        // Convert WebP to JPEG using sharp
        const jpgBuffer = await sharp(webpBuffer).toFormat('jpeg').toBuffer();

        // Now you can use jpgBuffer with loadImage
        const image = await loadImage(jpgBuffer);

        // Draw the avatar on the canvas (circular crop)
        const avatarSize = 500;
        const avatarX = 100;
        const avatarY = 100;
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true); // Circular crop
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        // Draw a simulated Discord status badge with a black border
        const badgeSize = 120; // Adjusted for size similar to Discord status
        const badgeX = avatarX + avatarSize - badgeSize * 0.6; // Position the badge near the bottom-right
        const badgeY = avatarY + avatarSize - badgeSize * 0.6;

        let badgeColor;
        const userStatus = targetUserObj.presence?.status || 'offline';

        // Determine badge color based on user status
        switch (userStatus) {
            case 'online':
                badgeColor = '#43b581'; // Green for online
                break;
            case 'idle':
                badgeColor = '#faa61a'; // Orange for idle
                break;
            case 'dnd':
                badgeColor = '#f04747'; // Red for Do Not Disturb
                break;
            case 'offline':
            default:
                badgeColor = '#747f8d'; // Grey for offline
                break;
        }

        // Draw the black border (slightly larger than the badge)
        const borderSize = badgeSize * 0.15; // Size for the black border
        ctx.fillStyle = backgroundColor; // Background color for the border
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, badgeSize / 2 + borderSize, 0, Math.PI * 2, true); // Larger circle for the border
        ctx.fill();

        // Draw the actual status badge (solid color)
        ctx.fillStyle = badgeColor;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, badgeSize / 2, 0, Math.PI * 2, true); // Inner badge circle
        ctx.fill();
        
        // Add the user's username to the canvas
        ctx.font = '100px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${targetUserObj.user.username}`, 700, 200);

        // Draw the progress bar
        const progressBarWidth = 800;
        const progressBarHeight = 50;
        const progressBarX = 700;
        const progressBarY = 400;

        // Background of the progress bar
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

        // Fill the progress bar
        const progressBarFillWidth = (currentXp / requiredXp) * progressBarWidth;
        ctx.fillStyle = '#00ff00'; // Green
        ctx.fillRect(progressBarX, progressBarY, progressBarFillWidth, progressBarHeight);

        // Draw a rectangular border around the progress bar
        const borderColor = '#000000'; // Black border color
        ctx.lineWidth = 10;
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

        // Create an attachment to send
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'canvas.png' });

        // Reply to the interaction with the canvas image
        await interaction.editReply({ files: [attachment] });
    },

    name: 'level',
    description: 'Check your/someone level',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to check the level of',
            type: ApplicationCommandOptionType.Mentionable
        }
    ]
};
