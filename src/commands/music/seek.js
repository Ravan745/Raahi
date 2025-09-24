const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'seek',
    description: 'Seek to a specific time in the current song',
    
    slashCommand: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current song')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time to seek to (e.g., 1:30, 90s)')
                .setRequired(true)
        ),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Time Provided')
                .setDescription('Please provide a time to seek to! (e.g., `1:30`, `90s`)')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Parse time
        let seekTime;
        const timeStr = args[0];
        
        if (timeStr.includes(':')) {
            const parts = timeStr.split(':');
            if (parts.length === 2) {
                const minutes = parseInt(parts[0]);
                const seconds = parseInt(parts[1]);
                if (!isNaN(minutes) && !isNaN(seconds)) {
                    seekTime = (minutes * 60 + seconds) * 1000;
                }
            }
        } else {
            seekTime = ms(timeStr);
        }

        if (!seekTime || seekTime < 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Time')
                .setDescription('Please provide a valid time format! (e.g., `1:30`, `90s`)')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Note: Seeking in Discord audio streams is complex and may not work perfectly
        // This is a placeholder implementation
        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('⏩ Seek Requested')
            .setDescription(`Seeking to **${timeStr}** is currently not fully supported.\nThis feature requires advanced audio stream handling.`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no song currently playing!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const timeStr = interaction.options.getString('time');
        
        // Parse time
        let seekTime;
        
        if (timeStr.includes(':')) {
            const parts = timeStr.split(':');
            if (parts.length === 2) {
                const minutes = parseInt(parts[0]);
                const seconds = parseInt(parts[1]);
                if (!isNaN(minutes) && !isNaN(seconds)) {
                    seekTime = (minutes * 60 + seconds) * 1000;
                }
            }
        } else {
            seekTime = ms(timeStr);
        }

        if (!seekTime || seekTime < 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Time')
                .setDescription('Please provide a valid time format! (e.g., `1:30`, `90s`)')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('⏩ Seek Requested')
            .setDescription(`Seeking to **${timeStr}** is currently not fully supported.\nThis feature requires advanced audio stream handling.`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};