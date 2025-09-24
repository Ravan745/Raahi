const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: '8d',
    description: 'Apply 8D audio filter',
    
    slashCommand: new SlashCommandBuilder()
        .setName('8d')
        .setDescription('Apply 8D audio filter'),

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

        const hasFilter = queue.filters.includes('8d');
        
        if (hasFilter) {
            queue.removeFilter('8d');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**8D Audio** filter has been disabled!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } else {
            queue.addFilter('8d');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**8D Audio** filter has been enabled!\n*Immersive surround sound experience*')
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

        const hasFilter = queue.filters.includes('8d');
        
        if (hasFilter) {
            queue.removeFilter('8d');
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🎚️ Filter Removed')
                .setDescription('**8D Audio** filter has been disabled!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } else {
            queue.addFilter('8d');
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎚️ Filter Applied')
                .setDescription('**8D Audio** filter has been enabled!\n*Immersive surround sound experience*')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }
};