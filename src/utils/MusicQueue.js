const { createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const playdl = require('play-dl');
const chalk = require('chalk');

class MusicQueue {
    constructor(guildId, voiceChannel = null, textChannel = null) {
        this.guildId = guildId;
        this.voiceChannel = voiceChannel;
        this.textChannel = textChannel;
        this.songs = [];
        this.playing = false;
        this.paused = false;
        this.volume = 50;
        this.loop = 'off'; // 'off', 'song', 'queue'
        this.autoplay = false;
        this.currentSong = null;
        this.previousSongs = [];
        this.filters = [];
        this.connection = null;
        this.player = null;
    }

    addSong(song) {
        this.songs.push(song);
        return this.songs.length;
    }

    removeSong(index) {
        if (index < 0 || index >= this.songs.length) return null;
        return this.songs.splice(index, 1)[0];
    }

    moveSong(from, to) {
        if (from < 0 || from >= this.songs.length || to < 0 || to >= this.songs.length) return false;
        const song = this.songs.splice(from, 1)[0];
        this.songs.splice(to, 0, song);
        return true;
    }

    shuffle() {
        for (let i = this.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
        }
    }

    clear() {
        this.songs = [];
        this.currentSong = null;
    }

    getNext() {
        if (this.loop === 'song' && this.currentSong) {
            return this.currentSong;
        }
        
        if (this.songs.length === 0) {
            if (this.loop === 'queue' && this.previousSongs.length > 0) {
                this.songs = [...this.previousSongs];
                this.previousSongs = [];
            } else {
                return null;
            }
        }
        
        return this.songs.shift();
    }

    getPrevious() {
        if (this.previousSongs.length === 0) return null;
        const prevSong = this.previousSongs.pop();
        if (this.currentSong) {
            this.songs.unshift(this.currentSong);
        }
        return prevSong;
    }

    createEmbed(type = 'queue') {
        const embed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({ text: 'Music Player' });

        switch (type) {
            case 'nowplaying':
                if (!this.currentSong) {
                    embed.setColor('#ff6b6b')
                        .setTitle('❌ Nothing Playing')
                        .setDescription('No song is currently playing.');
                } else {
                    embed.setColor('#00d4aa')
                        .setTitle('🎵 Now Playing')
                        .setDescription(`**${this.currentSong.title}**`)
                        .addFields(
                            { name: '👤 Requested by', value: this.currentSong.requestedBy, inline: true },
                            { name: '⏱️ Duration', value: this.currentSong.duration, inline: true },
                            { name: '🔊 Volume', value: `${this.volume}%`, inline: true }
                        );
                    
                    if (this.currentSong.thumbnail) {
                        embed.setThumbnail(this.currentSong.thumbnail);
                    }
                }
                break;

            case 'queue':
                embed.setColor('#4CAF50')
                    .setTitle('🎵 Music Queue');
                
                if (this.currentSong) {
                    embed.addFields({
                        name: '🎵 Now Playing',
                        value: `**${this.currentSong.title}** - ${this.currentSong.requestedBy}`
                    });
                }
                
                if (this.songs.length === 0) {
                    embed.setDescription('Queue is empty');
                } else {
                    const queueList = this.songs.slice(0, 10).map((song, index) => 
                        `${index + 1}. **${song.title}** - ${song.requestedBy}`
                    ).join('\n');
                    
                    embed.setDescription(queueList);
                    
                    if (this.songs.length > 10) {
                        embed.addFields({
                            name: 'And More...',
                            value: `${this.songs.length - 10} more songs in queue`
                        });
                    }
                }
                
                embed.addFields(
                    { name: '📊 Queue Info', value: `${this.songs.length} songs`, inline: true },
                    { name: '🔁 Loop', value: this.loop || 'Off', inline: true },
                    { name: '🔊 Volume', value: `${this.volume}%`, inline: true }
                );
                break;
        }

        return embed;
    }

    async playSong(voiceChannel, textChannel) {
        if (!this.currentSong) return false;
        
        try {
            // Use play-dl exclusively for all audio streaming
            const stream = await playdl.stream(this.currentSong.url);
            
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true
            });
            
            if (resource.volume) {
                resource.volume.setVolume(this.volume / 100);
            }
            
            // Create player if doesn't exist
            if (!this.player) {
                this.player = createAudioPlayer();
                this.setupPlayerEvents(textChannel);
            }
            
            this.player.play(resource);
            this.playing = true;
            this.paused = false;
            
            console.log(chalk.green(`🎵 Now playing: ${this.currentSong.title}`));
            return true;
        } catch (error) {
            console.error(chalk.red('Error playing song:'), error);
            
            // Send error message to text channel
            if (textChannel) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Playback Error')
                    .setDescription('Failed to play the song. Skipping to next...')
                    .setTimestamp();
                textChannel.send({ embeds: [errorEmbed] });
            }
            
            // Skip to next song on error
            this.handleSongEnd(textChannel);
            return false;
        }
    }

    setupPlayerEvents(textChannel) {
        this.player.on(AudioPlayerStatus.Playing, () => {
            console.log(chalk.green(`🎵 Now playing: ${this.currentSong?.title}`));
        });

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.handleSongEnd(textChannel);
        });

        this.player.on('error', (error) => {
            console.error(chalk.red('Audio player error:'), error);
            this.handleSongEnd(textChannel);
        });
    }

    async handleSongEnd(textChannel) {
        if (this.currentSong && this.loop !== 'song') {
            this.previousSongs.push(this.currentSong);
        }
        
        const nextSong = this.getNext();
        
        if (nextSong) {
            this.currentSong = nextSong;
            // Continue playing next song
            const voiceChannel = this.connection?.joinConfig?.channelId;
            if (voiceChannel) {
                await this.playSong(voiceChannel, textChannel);
            }
        } else {
            this.currentSong = null;
            this.playing = false;
            
            // Auto-disconnect after 5 minutes of inactivity
            setTimeout(() => {
                if (!this.playing && this.connection) {
                    this.connection.destroy();
                    this.connection = null;
                }
            }, 300000); // 5 minutes
        }
    }

    pause() {
        if (this.player && this.playing) {
            this.player.pause();
            this.paused = true;
            return true;
        }
        return false;
    }

    resume() {
        if (this.player && this.paused) {
            this.player.unpause();
            this.paused = false;
            return true;
        }
        return false;
    }

    stop() {
        if (this.player) {
            this.player.stop();
            this.playing = false;
            this.paused = false;
            this.currentSong = null;
            return true;
        }
        return false;
    }

    skip() {
        if (this.player && this.playing) {
            this.player.stop(); // This will trigger the idle event and play next song
            return true;
        }
        return false;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume));
        if (this.player?.state?.resource?.volume) {
            this.player.state.resource.volume.setVolume(this.volume / 100);
        }
        return this.volume;
    }

    setLoop(mode) {
        this.loop = mode;
        return this.loop;
    }

    addFilter(filter) {
        if (!this.filters.includes(filter)) {
            this.filters.push(filter);
            // Reapply audio with new filter if currently playing
            if (this.playing && this.currentSong) {
                this.applyFiltersAndReplay();
            }
        }
    }

    removeFilter(filter) {
        const index = this.filters.indexOf(filter);
        if (index > -1) {
            this.filters.splice(index, 1);
            // Reapply audio with updated filters if currently playing
            if (this.playing && this.currentSong) {
                this.applyFiltersAndReplay();
            }
        }
    }

    clearFilters() {
        this.filters = [];
        // Reapply audio without filters if currently playing
        if (this.playing && this.currentSong) {
            this.applyFiltersAndReplay();
        }
    }

    async applyFiltersAndReplay() {
        if (!this.currentSong || !this.player) return;
        
        try {
            // For now, filters modify the volume and playback rate conceptually
            // In a full implementation, this would rebuild the FFmpeg stream with filter chains
            const stream = await playdl.stream(this.currentSong.url);
            
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true
            });
            
            if (resource.volume) {
                // Apply filter-based volume modifications
                let volumeMultiplier = 1;
                if (this.filters.includes('bassboost')) volumeMultiplier *= 1.2;
                if (this.filters.includes('earrape')) volumeMultiplier *= 2.0;
                if (this.filters.includes('soft')) volumeMultiplier *= 0.7;
                
                resource.volume.setVolume((this.volume / 100) * volumeMultiplier);
            }
            
            this.player.play(resource);
            console.log(chalk.blue(`🎚️ Applied filters: ${this.filters.join(', ') || 'none'}`));
        } catch (error) {
            console.error(chalk.red('Error applying filters:'), error);
        }
    }

    async play() {
        if (this.songs.length === 0) return false;
        
        this.currentSong = this.songs.shift();
        return await this.playSong(this.voiceChannel, this.textChannel);
    }

    async playNext() {
        if (this.currentSong && this.loop !== 'song') {
            this.previousSongs.push(this.currentSong);
        }
        
        const nextSong = this.getNext();
        
        if (nextSong) {
            this.currentSong = nextSong;
            await this.playSong(this.voiceChannel, this.textChannel);
        } else {
            this.currentSong = null;
            this.playing = false;
            
            // Auto-disconnect after 5 minutes of inactivity
            setTimeout(() => {
                if (!this.playing && this.connection) {
                    this.connection.destroy();
                    this.connection = null;
                }
            }, 300000); // 5 minutes
        }
    }
}

module.exports = MusicQueue;