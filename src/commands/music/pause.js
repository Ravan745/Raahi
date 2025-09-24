const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Pause the current song',
    
    slashCommand: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song'),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing to pause!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (queue.paused) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Already Paused')
                .setDescription('The song is already paused!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        queue.pause();

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('⏸️ Song Paused')
            .setDescription(`Paused: **${queue.currentSong.title}**`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing to pause!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (queue.paused) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Already Paused')
                .setDescription('The song is already paused!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.pause();

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('⏸️ Song Paused')
            .setDescription(`Paused: **${queue.currentSong.title}**`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};