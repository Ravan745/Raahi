const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'resume',
    description: 'Resume the paused song',
    
    slashCommand: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing to resume!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (!queue.paused) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not Paused')
                .setDescription('The song is not paused!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        queue.resume();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('▶️ Song Resumed')
            .setDescription(`Resumed: **${queue.currentSong.title}**`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing to resume!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!queue.paused) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not Paused')
                .setDescription('The song is not paused!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.resume();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('▶️ Song Resumed')
            .setDescription(`Resumed: **${queue.currentSong.title}**`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};