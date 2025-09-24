const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const playdl = require('play-dl');
const MusicQueue = require('../../utils/MusicQueue');

module.exports = {
    name: 'play',
    description: 'Play a song from YouTube',
    aliases: ['p'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name or YouTube URL')
                .setRequired(true)
        ),

    async execute(message, args, client) {
        // Check if user is in voice channel
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Voice Channel')
                .setDescription('You need to be in a voice channel to play music!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Check if query provided
        if (!args.length) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Query')
                .setDescription('Please provide a song name or YouTube URL!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const query = args.join(' ');
        
        try {
            // Search for the song
            const searchResults = await playdl.search(query, { limit: 1 });
            if (!searchResults.length) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ No Results')
                    .setDescription('No songs found for your query!')
                    .setTimestamp();
                return message.reply({ embeds: [embed] });
            }

            const song = searchResults[0];
            const songData = {
                title: song.title,
                url: song.url,
                duration: song.durationRaw,
                thumbnail: song.thumbnails?.[0]?.url || null,
                requestedBy: message.author,
                channel: song.channel?.name || 'Unknown'
            };

            // Get or create queue
            let queue = client.musicQueues.get(message.guild.id);
            if (!queue) {
                queue = new MusicQueue(message.guild.id, voiceChannel, message.channel);
                client.musicQueues.set(message.guild.id, queue);
                
                // Connect to voice channel
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
                
                queue.connection = connection;
                queue.player = createAudioPlayer();
                
                // Handle connection events
                connection.on(VoiceConnectionStatus.Ready, () => {
                    console.log('Voice connection is ready!');
                });

                connection.on(VoiceConnectionStatus.Disconnected, () => {
                    console.log('Voice connection disconnected!');
                });

                // Subscribe the connection to the audio player
                connection.subscribe(queue.player);
                
                // Handle player events
                queue.player.on(AudioPlayerStatus.Playing, () => {
                    queue.playing = true;
                    queue.paused = false;
                });

                queue.player.on(AudioPlayerStatus.Idle, () => {
                    queue.playNext();
                });

                queue.player.on('error', error => {
                    console.error('Audio player error:', error);
                });
            }

            // Add song to queue
            queue.addSong(songData);

            if (!queue.playing) {
                queue.play();
                
                const embed = new EmbedBuilder()
                    .setColor('#4CAF50')
                    .setTitle('🎵 Now Playing')
                    .setDescription(`**[${songData.title}](${songData.url})**`)
                    .addFields(
                        { name: '👤 Requested by', value: songData.requestedBy.tag, inline: true },
                        { name: '⏱️ Duration', value: songData.duration, inline: true },
                        { name: '📺 Channel', value: songData.channel, inline: true }
                    )
                    .setThumbnail(songData.thumbnail)
                    .setTimestamp();
                
                return message.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#4CAF50')
                    .setTitle('✅ Added to Queue')
                    .setDescription(`**[${songData.title}](${songData.url})**`)
                    .addFields(
                        { name: '👤 Requested by', value: songData.requestedBy.tag, inline: true },
                        { name: '📍 Position', value: `${queue.songs.length}`, inline: true },
                        { name: '⏱️ Duration', value: songData.duration, inline: true }
                    )
                    .setThumbnail(songData.thumbnail)
                    .setTimestamp();
                
                return message.reply({ embeds: [embed] });
            }
            
        } catch (error) {
            console.error('Error playing song:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('An error occurred while trying to play the song!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }
    },

    async executeSlash(interaction, client) {
        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Voice Channel')
                .setDescription('You need to be in a voice channel to play music!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();
        const query = interaction.options.getString('query');
        
        try {
            // Search for the song
            const searchResults = await playdl.search(query, { limit: 1 });
            if (!searchResults.length) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ No Results')
                    .setDescription('No songs found for your query!')
                    .setTimestamp();
                return interaction.editReply({ embeds: [embed] });
            }

            const song = searchResults[0];
            const songData = {
                title: song.title,
                url: song.url,
                duration: song.durationRaw,
                thumbnail: song.thumbnails?.[0]?.url || null,
                requestedBy: interaction.user,
                channel: song.channel?.name || 'Unknown'
            };

            // Get or create queue
            let queue = client.musicQueues.get(interaction.guild.id);
            if (!queue) {
                queue = new MusicQueue(interaction.guild.id, voiceChannel, interaction.channel);
                client.musicQueues.set(interaction.guild.id, queue);
                
                // Connect to voice channel
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                
                queue.connection = connection;
                queue.player = createAudioPlayer();
                
                // Subscribe the connection to the audio player
                connection.subscribe(queue.player);
                
                // Handle player events
                queue.player.on(AudioPlayerStatus.Playing, () => {
                    queue.playing = true;
                    queue.paused = false;
                });

                queue.player.on(AudioPlayerStatus.Idle, () => {
                    queue.playNext();
                });

                queue.player.on('error', error => {
                    console.error('Audio player error:', error);
                });
            }

            // Add song to queue
            queue.addSong(songData);

            if (!queue.playing) {
                queue.play();
                
                const embed = new EmbedBuilder()
                    .setColor('#4CAF50')
                    .setTitle('🎵 Now Playing')
                    .setDescription(`**[${songData.title}](${songData.url})**`)
                    .addFields(
                        { name: '👤 Requested by', value: songData.requestedBy.tag, inline: true },
                        { name: '⏱️ Duration', value: songData.duration, inline: true },
                        { name: '📺 Channel', value: songData.channel, inline: true }
                    )
                    .setThumbnail(songData.thumbnail)
                    .setTimestamp();
                
                return interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#4CAF50')
                    .setTitle('✅ Added to Queue')
                    .setDescription(`**[${songData.title}](${songData.url})**`)
                    .addFields(
                        { name: '👤 Requested by', value: songData.requestedBy.tag, inline: true },
                        { name: '📍 Position', value: `${queue.songs.length}`, inline: true },
                        { name: '⏱️ Duration', value: songData.duration, inline: true }
                    )
                    .setThumbnail(songData.thumbnail)
                    .setTimestamp();
                
                return interaction.editReply({ embeds: [embed] });
            }
            
        } catch (error) {
            console.error('Error playing song:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('An error occurred while trying to play the song!')
                .setTimestamp();
            return interaction.editReply({ embeds: [embed] });
        }
    }
};