const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'nightcore',
    description: 'Apply nightcore filter',
    
    slashCommand: new SlashCommandBuilder()
        .setName('nightcore')
        .setDescription('Apply nightcore filter'),

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

        const hasFilter = queue.filters.includes('nightcore');
        
        if (hasFilter) {
            queue.removeFilter('nightcore');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**Nightcore** filter has been disabled!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } else {
            queue.addFilter('nightcore');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**Nightcore** filter has been enabled!\n*Higher pitch and faster tempo*')
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

        const hasFilter = queue.filters.includes('nightcore');
        
        if (hasFilter) {
            queue.removeFilter('nightcore');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**Nightcore** filter has been disabled!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } else {
            queue.addFilter('nightcore');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**Nightcore** filter has been enabled!\n*Higher pitch and faster tempo*')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }
};