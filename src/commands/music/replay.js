const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'replay',
    description: 'Replay the current song from the beginning',
    aliases: ['restart'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replay the current song from the beginning'),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || !queue.currentSong) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Restart the current song
        await queue.playSong(voiceChannel, message.channel);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🔄 Song Replaying')
            .setDescription(`Replaying: **${queue.currentSong.title}**`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || !queue.currentSong) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Restart the current song
        await queue.playSong(voiceChannel, interaction.channel);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🔄 Song Replaying')
            .setDescription(`Replaying: **${queue.currentSong.title}**`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};