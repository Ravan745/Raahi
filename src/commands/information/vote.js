const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'vote',
    description: 'Vote for the bot on bot lists',
    
    slashCommand: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Vote for the bot on bot lists'),

    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🗳️ Vote for Music Bot')
            .setDescription('Support the bot by voting on these platforms!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '🌟 Why Vote?',
                    value: '• Helps more people discover the bot\n• Shows appreciation for our work\n• Takes less than 30 seconds\n• Completely free to do!',
                    inline: false
                },
                {
                    name: '🎁 Vote Rewards',
                    value: '• Special voter role in support server\n• Priority support\n• Exclusive bot updates\n• Cool voting badges',
                    inline: false
                },
                {
                    name: '📊 Current Stats',
                    value: `• **Servers:** ${client.guilds.cache.size}\n• **Users:** ${client.users.cache.size}\n• **Votes:** ???+ (Help us grow!)`,
                    inline: true
                },
                {
                    name: '🚀 Growth Goal',
                    value: 'Help us reach:\n• 1,000 servers\n• 10,000 users\n• 500 votes/month',
                    inline: true
                }
            )
            .addFields(
                {
                    name: '💝 Thank You!',
                    value: 'Every vote matters and helps us improve the bot for everyone. We truly appreciate your support!',
                    inline: false
                }
            )
            .setFooter({ text: 'Thank you for supporting us!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Vote on Top.gg')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://top.gg/bot/vote')
                    .setEmoji('🗳️'),
                new ButtonBuilder()
                    .setLabel('Vote on DBL')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discordbotlist.com/bots/vote')
                    .setEmoji('⭐'),
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/support')
                    .setEmoji('💬')
            );

        return message.reply({ embeds: [embed], components: [row] });
    },

    async executeSlash(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🗳️ Vote for Music Bot')
            .setDescription('Support the bot by voting on these platforms!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '🌟 Why Vote?',
                    value: '• Helps more people discover the bot\n• Shows appreciation for our work\n• Takes less than 30 seconds\n• Completely free to do!',
                    inline: false
                },
                {
                    name: '🎁 Vote Rewards',
                    value: '• Special voter role in support server\n• Priority support\n• Exclusive bot updates\n• Cool voting badges',
                    inline: false
                },
                {
                    name: '📊 Current Stats',
                    value: `• **Servers:** ${client.guilds.cache.size}\n• **Users:** ${client.users.cache.size}\n• **Votes:** ???+ (Help us grow!)`,
                    inline: true
                },
                {
                    name: '🚀 Growth Goal',
                    value: 'Help us reach:\n• 1,000 servers\n• 10,000 users\n• 500 votes/month',
                    inline: true
                }
            )
            .addFields(
                {
                    name: '💝 Thank You!',
                    value: 'Every vote matters and helps us improve the bot for everyone. We truly appreciate your support!',
                    inline: false
                }
            )
            .setFooter({ text: 'Thank you for supporting us!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Vote on Top.gg')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://top.gg/bot/vote')
                    .setEmoji('🗳️'),
                new ButtonBuilder()
                    .setLabel('Vote on DBL')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discordbotlist.com/bots/vote')
                    .setEmoji('⭐'),
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/support')
                    .setEmoji('💬')
            );

        return interaction.reply({ embeds: [embed], components: [row] });
    }
};