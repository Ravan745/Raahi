const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'distortion',
    description: 'Apply distortion filter',
    
    slashCommand: new SlashCommandBuilder()
        .setName('distortion')
        .setDescription('Apply distortion filter'),

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

        const hasFilter = queue.filters.includes('distortion');
        
        if (hasFilter) {
            queue.removeFilter('distortion');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**Distortion** filter has been disabled!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } else {
            queue.addFilter('distortion');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**Distortion** filter has been enabled!\n*Aggressive audio distortion*')
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

        const hasFilter = queue.filters.includes('distortion');
        
        if (hasFilter) {
            queue.removeFilter('distortion');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**Distortion** filter has been disabled!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } else {
            queue.addFilter('distortion');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**Distortion** filter has been enabled!\n*Aggressive audio distortion*')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }
};