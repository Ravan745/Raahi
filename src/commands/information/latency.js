const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'latency',
    description: 'Check bot latency and API ping',
    aliases: ['ping'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('latency')
        .setDescription('Check bot latency and API ping'),

    async execute(message, args, client) {
        const sent = await message.reply('🏓 Pinging...');
        
        const botLatency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);
        
        let latencyColor = '#4CAF50'; // Green
        if (botLatency > 200 || apiLatency > 200) latencyColor = '#FFA500'; // Orange
        if (botLatency > 500 || apiLatency > 500) latencyColor = '#ff6b6b'; // Red

        const embed = new EmbedBuilder()
            .setColor(latencyColor)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '🤖 Bot Latency', value: `${botLatency}ms`, inline: true },
                { name: '📡 API Latency', value: `${apiLatency}ms`, inline: true },
                { name: '📊 Status', value: this.getLatencyStatus(Math.max(botLatency, apiLatency)), inline: true }
            )
            .setFooter({ text: 'Lower is better!' })
            .setTimestamp();

        return sent.edit({ content: '', embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        await interaction.deferReply();
        
        const botLatency = Date.now() - interaction.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);
        
        let latencyColor = '#4CAF50'; // Green
        if (botLatency > 200 || apiLatency > 200) latencyColor = '#FFA500'; // Orange
        if (botLatency > 500 || apiLatency > 500) latencyColor = '#ff6b6b'; // Red

        const embed = new EmbedBuilder()
            .setColor(latencyColor)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '🤖 Bot Latency', value: `${botLatency}ms`, inline: true },
                { name: '📡 API Latency', value: `${apiLatency}ms`, inline: true },
                { name: '📊 Status', value: this.getLatencyStatus(Math.max(botLatency, apiLatency)), inline: true }
            )
            .setFooter({ text: 'Lower is better!' })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    },

    getLatencyStatus(latency) {
        if (latency < 100) return '🟢 Excellent';
        if (latency < 200) return '🟡 Good';
        if (latency < 500) return '🟠 Fair';
        return '🔴 Poor';
    }
};