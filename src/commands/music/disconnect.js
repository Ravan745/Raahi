const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'disconnect',
    description: 'Disconnect the bot from voice channel',
    aliases: ['dc', 'leave'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnect the bot from voice channel'),

    async execute(message, args, client) {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to disconnect the bot!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const connection = getVoiceConnection(message.guild.id);
        if (!connection) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not Connected')
                .setDescription('The bot is not connected to any voice channel!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Clear queue and stop music
        const queue = client.musicQueues.get(message.guild.id);
        if (queue) {
            queue.stop();
            queue.clear();
            client.musicQueues.delete(message.guild.id);
        }

        connection.destroy();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('👋 Disconnected')
            .setDescription(`Disconnected from **${voiceChannel.name}**`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to disconnect the bot!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const connection = getVoiceConnection(interaction.guild.id);
        if (!connection) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not Connected')
                .setDescription('The bot is not connected to any voice channel!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Clear queue and stop music
        const queue = client.musicQueues.get(interaction.guild.id);
        if (queue) {
            queue.stop();
            queue.clear();
            client.musicQueues.delete(interaction.guild.id);
        }

        connection.destroy();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('👋 Disconnected')
            .setDescription(`Disconnected from **${voiceChannel.name}**`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};