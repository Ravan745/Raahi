const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'clearqueue',
    description: 'Clear the music queue',
    aliases: ['clear', 'cq'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('clearqueue')
        .setDescription('Clear the music queue'),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Queue')
                .setDescription('There is no music queue for this server!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to clear the queue!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const clearedSongs = queue.songs.length;
        queue.clear();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🗑️ Queue Cleared')
            .setDescription(`Cleared **${clearedSongs}** songs from the queue!`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Queue')
                .setDescription('There is no music queue for this server!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to clear the queue!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const clearedSongs = queue.songs.length;
        queue.clear();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🗑️ Queue Cleared')
            .setDescription(`Cleared **${clearedSongs}** songs from the queue!`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};