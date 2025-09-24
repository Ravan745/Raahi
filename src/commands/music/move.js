const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'move',
    description: 'Move a song to a different position in the queue',
    
    slashCommand: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move a song to a different position in the queue')
        .addIntegerOption(option =>
            option.setName('from')
                .setDescription('Current position of the song')
                .setRequired(true)
                .setMinValue(1)
        )
        .addIntegerOption(option =>
            option.setName('to')
                .setDescription('New position for the song')
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Empty Queue')
                .setDescription('The queue is empty!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const from = parseInt(args[0]);
        const to = parseInt(args[1]);

        if (isNaN(from) || isNaN(to) || from < 1 || to < 1 || from > queue.songs.length || to > queue.songs.length) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Positions')
                .setDescription(`Please provide valid positions (1-${queue.songs.length})`)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const songTitle = queue.songs[from - 1].title;
        const success = queue.moveSong(from - 1, to - 1);

        if (!success) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Move Failed')
                .setDescription('Failed to move the song!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('📁 Song Moved')
            .setDescription(`Moved **${songTitle}** from position ${from} to ${to}`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Empty Queue')
                .setDescription('The queue is empty!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const from = interaction.options.getInteger('from');
        const to = interaction.options.getInteger('to');

        if (from < 1 || to < 1 || from > queue.songs.length || to > queue.songs.length) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Positions')
                .setDescription(`Please provide valid positions (1-${queue.songs.length})`)
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const songTitle = queue.songs[from - 1].title;
        const success = queue.moveSong(from - 1, to - 1);

        if (!success) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Move Failed')
                .setDescription('Failed to move the song!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('📁 Song Moved')
            .setDescription(`Moved **${songTitle}** from position ${from} to ${to}`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};