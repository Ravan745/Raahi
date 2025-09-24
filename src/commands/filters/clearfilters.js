const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'clearfilters',
    description: 'Clear all active audio filters',
    aliases: ['removefilters'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('clearfilters')
        .setDescription('Clear all active audio filters'),

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

        if (queue.filters.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Filters')
                .setDescription('There are no active filters to clear!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const filterCount = queue.filters.length;
        queue.clearFilters();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🗑️ Filters Cleared')
            .setDescription(`Cleared **${filterCount}** active audio filters!`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
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

        if (queue.filters.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Filters')
                .setDescription('There are no active filters to clear!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const filterCount = queue.filters.length;
        queue.clearFilters();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🗑️ Filters Cleared')
            .setDescription(`Cleared **${filterCount}** active audio filters!`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};