const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'support',
    description: 'Get support and help resources',
    
    slashCommand: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Get support and help resources'),

    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle('🛠️ Support & Help')
            .setDescription('Need help with the bot? Here are your options!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '💬 Discord Support Server',
                    value: 'Join our support server for:\n• Live help from moderators\n• Community discussions\n• Bot updates and announcements\n• Feature requests',
                    inline: false
                },
                {
                    name: '📋 Common Issues',
                    value: '• **Bot not responding:** Check bot permissions\n• **No audio:** Ensure bot has voice permissions\n• **Commands not working:** Try using slash commands\n• **Queue issues:** Use `clearqueue` to reset',
                    inline: false
                },
                {
                    name: '🎵 Quick Commands',
                    value: '• `/help` - View all commands\n• `/setup` - Initial bot setup\n• `/play <song>` - Start playing music\n• `/premium check` - Check premium status',
                    inline: false
                },
                {
                    name: '💎 Premium Support',
                    value: 'Premium users get:\n• Priority support\n• Faster response times\n• Advanced troubleshooting\n• Direct developer contact',
                    inline: false
                }
            )
            .addFields(
                {
                    name: '📞 Contact Methods',
                    value: '1. **Discord Server** - Fastest response\n2. **Direct Message** - For private issues\n3. **GitHub Issues** - For bug reports',
                    inline: false
                }
            )
            .setFooter({ text: 'We\'re here to help!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/support')
                    .setEmoji('🛠️'),
                new ButtonBuilder()
                    .setLabel('Bot Commands')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('help_commands')
                    .setEmoji('📋'),
                new ButtonBuilder()
                    .setLabel('Report Bug')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/musicbot/issues')
                    .setEmoji('🐛')
            );

        return message.reply({ embeds: [embed], components: [row] });
    },

    async executeSlash(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle('🛠️ Support & Help')
            .setDescription('Need help with the bot? Here are your options!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '💬 Discord Support Server',
                    value: 'Join our support server for:\n• Live help from moderators\n• Community discussions\n• Bot updates and announcements\n• Feature requests',
                    inline: false
                },
                {
                    name: '📋 Common Issues',
                    value: '• **Bot not responding:** Check bot permissions\n• **No audio:** Ensure bot has voice permissions\n• **Commands not working:** Try using slash commands\n• **Queue issues:** Use `/clearqueue` to reset',
                    inline: false
                },
                {
                    name: '🎵 Quick Commands',
                    value: '• `/help` - View all commands\n• `/setup` - Initial bot setup\n• `/play <song>` - Start playing music\n• `/premium check` - Check premium status',
                    inline: false
                },
                {
                    name: '💎 Premium Support',
                    value: 'Premium users get:\n• Priority support\n• Faster response times\n• Advanced troubleshooting\n• Direct developer contact',
                    inline: false
                }
            )
            .addFields(
                {
                    name: '📞 Contact Methods',
                    value: '1. **Discord Server** - Fastest response\n2. **Direct Message** - For private issues\n3. **GitHub Issues** - For bug reports',
                    inline: false
                }
            )
            .setFooter({ text: 'We\'re here to help!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/support')
                    .setEmoji('🛠️'),
                new ButtonBuilder()
                    .setLabel('Bot Commands')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('help_commands')
                    .setEmoji('📋'),
                new ButtonBuilder()
                    .setLabel('Report Bug')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/musicbot/issues')
                    .setEmoji('🐛')
            );

        return interaction.reply({ embeds: [embed], components: [row] });
    }
};