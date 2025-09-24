const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'volume',
    description: 'Set or check the music volume',
    aliases: ['vol', 'v'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set or check the music volume')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (0-100)')
                .setMinValue(0)
                .setMaxValue(100)
        ),

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

        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🔊 Current Volume')
                .setDescription(`Current volume: **${queue.volume}%**`)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 100) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Volume')
                .setDescription('Volume must be a number between 0 and 100!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const newVolume = queue.setVolume(volume);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🔊 Volume Changed')
            .setDescription(`Volume set to **${newVolume}%**`)
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

        const volume = interaction.options.getInteger('level');

        if (!volume) {
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('🔊 Current Volume')
                .setDescription(`Current volume: **${queue.volume}%**`)
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }

        const newVolume = queue.setVolume(volume);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🔊 Volume Changed')
            .setDescription(`Volume set to **${newVolume}%**`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};