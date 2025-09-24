const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Skip the current song',
    aliases: ['s'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing to skip!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to skip songs!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const skippedSong = queue.currentSong;
        queue.skip();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('⏭️ Song Skipped')
            .setDescription(`Skipped: **${skippedSong.title}**`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing to skip!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to skip songs!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const skippedSong = queue.currentSong;
        queue.skip();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('⏭️ Song Skipped')
            .setDescription(`Skipped: **${skippedSong.title}**`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};