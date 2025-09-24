const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'stop',
    description: 'Stop the music and clear the queue',
    
    slashCommand: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and clear the queue'),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing to stop!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to stop music!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        queue.stop();
        queue.clear();

        const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('⏹️ Music Stopped')
            .setDescription('Music stopped and queue cleared!')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing to stop!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to stop music!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.stop();
        queue.clear();

        const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('⏹️ Music Stopped')
            .setDescription('Music stopped and queue cleared!')
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};