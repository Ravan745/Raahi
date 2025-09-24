const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const lyricsSearcher = require('lyrics-finder');

module.exports = {
    name: 'lyrics',
    description: 'Get lyrics for the current song or search for lyrics',
    
    slashCommand: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Get lyrics for the current song or search for lyrics')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song to search lyrics for (optional)')
        ),

    async execute(message, args, client) {
        let songQuery;
        
        if (args.length > 0) {
            songQuery = args.join(' ');
        } else {
            const queue = client.musicQueues.get(message.guild.id);
            if (!queue || !queue.currentSong) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ No Song')
                    .setDescription('No song is currently playing! Please provide a song name.')
                    .setTimestamp();
                return message.reply({ embeds: [embed] });
            }
            songQuery = queue.currentSong.title;
        }

        const loadingEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🔍 Searching Lyrics')
            .setDescription(`Searching for lyrics: **${songQuery}**`)
            .setTimestamp();
        
        const loadingMessage = await message.reply({ embeds: [loadingEmbed] });

        try {
            const lyrics = await lyricsSearcher(songQuery);
            
            if (!lyrics) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ No Lyrics Found')
                    .setDescription(`Could not find lyrics for: **${songQuery}**`)
                    .setTimestamp();
                return loadingMessage.edit({ embeds: [embed] });
            }

            // Discord embed has a 4096 character limit for description
            const truncatedLyrics = lyrics.length > 4000 ? lyrics.substring(0, 4000) + '...' : lyrics;

            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle(`🎵 Lyrics: ${songQuery}`)
                .setDescription(truncatedLyrics)
                .setTimestamp();

            if (lyrics.length > 4000) {
                embed.setFooter({ text: 'Lyrics truncated due to length limit' });
            }

            return loadingMessage.edit({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('Failed to fetch lyrics. Please try again later.')
                .setTimestamp();
            return loadingMessage.edit({ embeds: [embed] });
        }
    },

    async executeSlash(interaction, client) {
        let songQuery = interaction.options.getString('song');
        
        if (!songQuery) {
            const queue = client.musicQueues.get(interaction.guild.id);
            if (!queue || !queue.currentSong) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ No Song')
                    .setDescription('No song is currently playing! Please provide a song name.')
                    .setTimestamp();
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            songQuery = queue.currentSong.title;
        }

        await interaction.deferReply();

        try {
            const lyrics = await lyricsSearcher(songQuery);
            
            if (!lyrics) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ No Lyrics Found')
                    .setDescription(`Could not find lyrics for: **${songQuery}**`)
                    .setTimestamp();
                return interaction.editReply({ embeds: [embed] });
            }

            const truncatedLyrics = lyrics.length > 4000 ? lyrics.substring(0, 4000) + '...' : lyrics;

            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle(`🎵 Lyrics: ${songQuery}`)
                .setDescription(truncatedLyrics)
                .setTimestamp();

            if (lyrics.length > 4000) {
                embed.setFooter({ text: 'Lyrics truncated due to length limit' });
            }

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('Failed to fetch lyrics. Please try again later.')
                .setTimestamp();
            return interaction.editReply({ embeds: [embed] });
        }
    }
};