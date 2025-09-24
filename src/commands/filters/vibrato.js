const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'vibrato',
    description: 'Apply vibrato filter',
    
    slashCommand: new SlashCommandBuilder()
        .setName('vibrato')
        .setDescription('Apply vibrato filter'),

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

        const hasFilter = queue.filters.includes('vibrato');
        
        if (hasFilter) {
            queue.removeFilter('vibrato');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**Vibrato** filter has been disabled!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } else {
            queue.addFilter('vibrato');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**Vibrato** filter has been enabled!\n*Pitch oscillation effect*')
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

        const hasFilter = queue.filters.includes('vibrato');
        
        if (hasFilter) {
            queue.removeFilter('vibrato');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**Vibrato** filter has been disabled!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } else {
            queue.addFilter('vibrato');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**Vibrato** filter has been enabled!\n*Pitch oscillation effect*')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }
};