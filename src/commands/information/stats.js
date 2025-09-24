const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'stats',
    description: 'Display bot statistics',
    aliases: ['statistics'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Display bot statistics'),

    async execute(message, args, client) {
        const embed = await this.createStatsEmbed(client);
        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const embed = await this.createStatsEmbed(client);
        return interaction.reply({ embeds: [embed] });
    },

    async createStatsEmbed(client) {
        const memoryUsage = process.memoryUsage();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;

        // Count active music queues
        const activeQueues = client.musicQueues.size;
        const playingQueues = Array.from(client.musicQueues.values()).filter(q => q.playing).length;

        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle('📊 Bot Statistics')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '🤖 Bot Info',
                    value: `**Servers:** ${client.guilds.cache.size}\n**Users:** ${client.users.cache.size}\n**Channels:** ${client.channels.cache.size}\n**Commands:** 51+`,
                    inline: true
                },
                {
                    name: '🎵 Music Stats',
                    value: `**Active Queues:** ${activeQueues}\n**Playing Now:** ${playingQueues}\n**Voice Connections:** ${client.voiceConnections.size}`,
                    inline: true
                },
                {
                    name: '⚡ Performance',
                    value: `**Uptime:** ${this.formatUptime(client.uptime)}\n**API Latency:** ${Math.round(client.ws.ping)}ms\n**Commands Used:** 0`, // You can track this in your database
                    inline: true
                },
                {
                    name: '💾 Memory Usage',
                    value: `**Bot Memory:** ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB\n**System Memory:** ${Math.round(usedMemory / 1024 / 1024 / 1024 * 100) / 100}GB / ${Math.round(totalMemory / 1024 / 1024 / 1024 * 100) / 100}GB\n**CPU Usage:** ${Math.round(os.loadavg()[0] * 100)}%`,
                    inline: true
                },
                {
                    name: '🖥️ System Info',
                    value: `**Platform:** ${os.platform()}\n**Architecture:** ${os.arch()}\n**Node.js:** ${process.version}\n**Discord.js:** v14`,
                    inline: true
                },
                {
                    name: '🔧 Features',
                    value: '**Music Commands:** 19\n**Audio Filters:** 16\n**Utility Commands:** 10\n**Info Commands:** 6',
                    inline: true
                }
            )
            .setFooter({ text: `Bot ID: ${client.user.id}` })
            .setTimestamp();

        return embed;
    },

    formatUptime(uptime) {
        const seconds = Math.floor((uptime / 1000) % 60);
        const minutes = Math.floor((uptime / (1000 * 60)) % 60);
        const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
};