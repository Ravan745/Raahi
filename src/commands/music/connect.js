const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    name: 'connect',
    description: 'Connect the bot to your voice channel',
    aliases: ['join'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('Connect the bot to your voice channel'),

    async execute(message, args, client) {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel first!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            // Store connection
            client.voiceConnections.set(message.guild.id, connection);

            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎵 Connected')
                .setDescription(`Connected to **${voiceChannel.name}**`)
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error connecting to voice channel:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Connection Failed')
                .setDescription('Failed to connect to the voice channel!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }
    },

    async executeSlash(interaction, client) {
        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel first!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Store connection
            client.voiceConnections.set(interaction.guild.id, connection);

            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🎵 Connected')
                .setDescription(`Connected to **${voiceChannel.name}**`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error connecting to voice channel:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Connection Failed')
                .setDescription('Failed to connect to the voice channel!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }
};