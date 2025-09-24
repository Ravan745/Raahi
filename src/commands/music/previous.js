const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'previous',
    description: 'Play the previous song',
    aliases: ['prev', 'back'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Play the previous song'),

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
                .setDescription('You need to be in a voice channel!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const previousSong = queue.getPrevious();
        if (!previousSong) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Previous Song')
                .setDescription('There is no previous song to play!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        queue.currentSong = previousSong;
        await queue.playSong(voiceChannel, message.channel);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('⏮️ Playing Previous')
            .setDescription(`Now playing: **${previousSong.title}**`)
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
                .setDescription('You need to be in a voice channel!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const previousSong = queue.getPrevious();
        if (!previousSong) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Previous Song')
                .setDescription('There is no previous song to play!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.currentSong = previousSong;
        await queue.playSong(voiceChannel, interaction.channel);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('⏮️ Playing Previous')
            .setDescription(`Now playing: **${previousSong.title}**`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};