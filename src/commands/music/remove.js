const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'remove',
    description: 'Remove a song from the queue',
    aliases: ['rm'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Position of song to remove')
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Empty Queue')
                .setDescription('The queue is empty!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const position = parseInt(args[0]);
        if (isNaN(position) || position < 1 || position > queue.songs.length) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Position')
                .setDescription(`Please provide a valid position (1-${queue.songs.length})`)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const removedSong = queue.removeSong(position - 1);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🗑️ Song Removed')
            .setDescription(`Removed: **${removedSong.title}**`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Empty Queue')
                .setDescription('The queue is empty!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const position = interaction.options.getInteger('position');
        if (position < 1 || position > queue.songs.length) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Position')
                .setDescription(`Please provide a valid position (1-${queue.songs.length})`)
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const removedSong = queue.removeSong(position - 1);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🗑️ Song Removed')
            .setDescription(`Removed: **${removedSong.title}**`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};