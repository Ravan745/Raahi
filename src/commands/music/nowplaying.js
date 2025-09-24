const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'nowplaying',
    description: 'Display the currently playing song',
    aliases: ['np', 'current'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Display the currently playing song'),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || !queue.currentSong) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('No song is currently playing!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const embed = queue.createEmbed('nowplaying');
        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || !queue.currentSong) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('No song is currently playing!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = queue.createEmbed('nowplaying');
        return interaction.reply({ embeds: [embed] });
    }
};