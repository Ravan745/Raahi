const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'about',
    description: 'Information about the bot',
    
    slashCommand: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Information about the bot'),

    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle('🎵 About Discord Music Bot')
            .setDescription('A comprehensive music bot with extensive features and premium capabilities!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '📊 Bot Statistics',
                    value: `**Servers:** ${client.guilds.cache.size}\n**Users:** ${client.users.cache.size}\n**Commands:** 51+\n**Uptime:** ${this.formatUptime(client.uptime)}`,
                    inline: true
                },
                {
                    name: '🎵 Features',
                    value: '• High-quality music streaming\n• 19 Music commands\n• 16 Audio filters\n• YouTube support\n• Queue management\n• No-prefix commands',
                    inline: true
                },
                {
                    name: '💎 Premium Features',
                    value: '• Unlimited usage\n• Priority support\n• Advanced audio filters\n• Custom settings\n• Credits system',
                    inline: true
                },
                {
                    name: '🛠️ Technology Stack',
                    value: '• Discord.js v14\n• Node.js\n• FFmpeg\n• YouTube API\n• SQLite Database',
                    inline: true
                },
                {
                    name: '👨‍💻 Developer',
                    value: 'Developed with ❤️ for Discord communities\nVersion: 1.0.0',
                    inline: true
                },
                {
                    name: '🔗 Links',
                    value: '[Invite Bot](https://discord.com/oauth2/authorize) • [Support Server](https://discord.gg/support) • [Vote](https://top.gg/bot)',
                    inline: true
                }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle('🎵 About Discord Music Bot')
            .setDescription('A comprehensive music bot with extensive features and premium capabilities!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '📊 Bot Statistics',
                    value: `**Servers:** ${client.guilds.cache.size}\n**Users:** ${client.users.cache.size}\n**Commands:** 51+\n**Uptime:** ${this.formatUptime(client.uptime)}`,
                    inline: true
                },
                {
                    name: '🎵 Features',
                    value: '• High-quality music streaming\n• 19 Music commands\n• 16 Audio filters\n• YouTube support\n• Queue management\n• No-prefix commands',
                    inline: true
                },
                {
                    name: '💎 Premium Features',
                    value: '• Unlimited usage\n• Priority support\n• Advanced audio filters\n• Custom settings\n• Credits system',
                    inline: true
                },
                {
                    name: '🛠️ Technology Stack',
                    value: '• Discord.js v14\n• Node.js\n• FFmpeg\n• YouTube API\n• SQLite Database',
                    inline: true
                },
                {
                    name: '👨‍💻 Developer',
                    value: 'Developed with ❤️ for Discord communities\nVersion: 1.0.0',
                    inline: true
                },
                {
                    name: '🔗 Links',
                    value: '[Invite Bot](https://discord.com/oauth2/authorize) • [Support Server](https://discord.gg/support) • [Vote](https://top.gg/bot)',
                    inline: true
                }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },

    formatUptime(uptime) {
        const seconds = Math.floor((uptime / 1000) % 60);
        const minutes = Math.floor((uptime / (1000 * 60)) % 60);
        const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
};