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

        // Draw the border (slightly larger than the badge)
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

        //Display user's level
        ctx.font = '50px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(`Level: ${currentLevel}`, 700, 300);

        ctx.font = '80px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${currentXp} / ${requiredXp} XP`, 700, 550);

        // Draw the progress bar
        const progressBarWidth = 1000;
        const progressBarHeight = 50;
        const progressBarX = 700;
        const progressBarY = 400;
        const progressBarRadius = 25;

        ctx.beginPath();
        
        //background of progress bar
        ctx.moveTo(progressBarX + progressBarRadius, progressBarY);
        ctx.arcTo(progressBarX + progressBarWidth, progressBarY, progressBarX + progressBarWidth, progressBarY + progressBarHeight, progressBarRadius); // Top-right corner
        ctx.arcTo(progressBarX + progressBarWidth, progressBarY + progressBarHeight, progressBarX, progressBarY + progressBarHeight, progressBarRadius); // Bottom-right corner
        ctx.arcTo(progressBarX, progressBarY + progressBarHeight, progressBarX, progressBarY, progressBarRadius); // Bottom-left corner
        ctx.arcTo(progressBarX, progressBarY, progressBarX + progressBarWidth, progressBarY, progressBarRadius); // Back to top-left
        ctx.closePath();
        ctx.fillStyle = '#ffffff'; // Fill color
        ctx.fill();

        // Draw the border if needed
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        ctx.beginPath();
        
        // Fill the progress bar
        const progressBarFillWidth = (currentXp / requiredXp) * progressBarWidth;
        const progressBarFillHeight = 40;
        const progressBarFillY = 405;
        ctx.moveTo(progressBarX + progressBarRadius, progressBarFillY);
        ctx.arcTo(progressBarX + progressBarFillWidth, progressBarFillY, progressBarX + progressBarFillWidth, progressBarFillY + progressBarFillHeight, progressBarRadius); // Top-right corner
        ctx.arcTo(progressBarX + progressBarFillWidth, progressBarFillY + progressBarFillHeight, progressBarX, progressBarFillY + progressBarFillHeight, progressBarRadius); // Bottom-right corner
        ctx.arcTo(progressBarX, progressBarFillY + progressBarFillHeight, progressBarX, progressBarFillY, progressBarRadius); // Bottom-left corner
        ctx.arcTo(progressBarX, progressBarFillY, progressBarX + progressBarFillWidth, progressBarFillY, progressBarRadius); // Back to top-left
        ctx.closePath();
        ctx.fillStyle = '#00ff00'; // Green
        ctx.fill();


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
