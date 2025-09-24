const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'autoplay',
    description: 'Toggle autoplay mode',
    aliases: ['ap'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle autoplay mode'),

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
                .setDescription('You need to be in a voice channel to toggle autoplay!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        queue.autoplay = !queue.autoplay;

        const embed = new EmbedBuilder()
            .setColor(queue.autoplay ? '#4CAF50' : '#ff6b6b')
            .setTitle(`${queue.autoplay ? '✅' : '❌'} Autoplay ${queue.autoplay ? 'Enabled' : 'Disabled'}`)
            .setDescription(queue.autoplay ? 
                'The bot will now automatically play related songs when the queue ends.' : 
                'The bot will stop when the queue ends.')
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
                .setDescription('You need to be in a voice channel to toggle autoplay!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.autoplay = !queue.autoplay;

        const embed = new EmbedBuilder()
            .setColor(queue.autoplay ? '#4CAF50' : '#ff6b6b')
            .setTitle(`${queue.autoplay ? '✅' : '❌'} Autoplay ${queue.autoplay ? 'Enabled' : 'Disabled'}`)
            .setDescription(queue.autoplay ? 
                'The bot will now automatically play related songs when the queue ends.' : 
                'The bot will stop when the queue ends.')
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};