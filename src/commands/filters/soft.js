const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'soft',
    description: 'Apply soft filter',
    
    slashCommand: new SlashCommandBuilder()
        .setName('soft')
        .setDescription('Apply soft filter'),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const hasFilter = queue.filters.includes('soft');
        
        if (hasFilter) {
            queue.removeFilter('soft');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**Soft** filter has been disabled!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } else {
            queue.addFilter('soft');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**Soft** filter has been enabled!\n*Gentle and mellow sound*')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const hasFilter = queue.filters.includes('soft');
        
        if (hasFilter) {
            queue.removeFilter('soft');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**Soft** filter has been disabled!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } else {
            queue.addFilter('soft');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**Soft** filter has been enabled!\n*Gentle and mellow sound*')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }
};