const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Get the bot invite link',
    
    slashCommand: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get the bot invite link'),

    async execute(message, args, client) {
        const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
        
        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle('🎵 Invite Music Bot')
            .setDescription('Add this amazing music bot to your server!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '🎵 Features',
                    value: '• High-quality music streaming\n• 51+ commands\n• 16 audio filters\n• Queue management\n• Premium features',
                    inline: true
                },
                {
                    name: '🔧 Permissions',
                    value: '• Send Messages\n• Use Slash Commands\n• Connect to Voice\n• Speak in Voice\n• Manage Messages',
                    inline: true
                },
                {
                    name: '🚀 Getting Started',
                    value: '1. Click the invite link below\n2. Select your server\n3. Authorize permissions\n4. Use `/help` to get started!',
                    inline: false
                }
            )
            .addFields({
                name: '🔗 Invite Link',
                value: `[Click here to invite the bot](${inviteLink})`,
                inline: false
            })
            .setFooter({ text: 'Thanks for choosing our music bot!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Invite Bot')
                    .setStyle(ButtonStyle.Link)
                    .setURL(inviteLink)
                    .setEmoji('🎵'),
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/support')
                    .setEmoji('🛠️')
            );

        return message.reply({ embeds: [embed], components: [row] });
    },

    async executeSlash(interaction, client) {
        const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
        
        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle('🎵 Invite Music Bot')
            .setDescription('Add this amazing music bot to your server!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '🎵 Features',
                    value: '• High-quality music streaming\n• 51+ commands\n• 16 audio filters\n• Queue management\n• Premium features',
                    inline: true
                },
                {
                    name: '🔧 Permissions',
                    value: '• Send Messages\n• Use Slash Commands\n• Connect to Voice\n• Speak in Voice\n• Manage Messages',
                    inline: true
                },
                {
                    name: '🚀 Getting Started',
                    value: '1. Click the invite link below\n2. Select your server\n3. Authorize permissions\n4. Use `/help` to get started!',
                    inline: false
                }
            )
            .addFields({
                name: '🔗 Invite Link',
                value: `[Click here to invite the bot](${inviteLink})`,
                inline: false
            })
            .setFooter({ text: 'Thanks for choosing our music bot!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Invite Bot')
                    .setStyle(ButtonStyle.Link)
                    .setURL(inviteLink)
                    .setEmoji('🎵'),
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/support')
                    .setEmoji('🛠️')
            );

        return interaction.reply({ embeds: [embed], components: [row] });
    }
};