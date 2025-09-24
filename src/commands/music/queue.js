const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'Display the current music queue',
    aliases: ['q'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current music queue'),

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

        const embed = queue.createEmbed('queue');
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

        const embed = queue.createEmbed('queue');
        return interaction.reply({ embeds: [embed] });
    }
};