const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'shuffle',
    description: 'Shuffle the music queue',
    
    slashCommand: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the music queue'),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Empty Queue')
                .setDescription('The queue is empty or doesn\'t exist!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to shuffle the queue!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        queue.shuffle();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🔀 Queue Shuffled')
            .setDescription(`Shuffled **${queue.songs.length}** songs in the queue!`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Empty Queue')
                .setDescription('The queue is empty or doesn\'t exist!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to shuffle the queue!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.shuffle();

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🔀 Queue Shuffled')
            .setDescription(`Shuffled **${queue.songs.length}** songs in the queue!`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};